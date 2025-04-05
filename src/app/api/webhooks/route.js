import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  if (!SIGNING_SECRET) throw new Error('Missing SIGNING_SECRET');

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = headers();
  
  try {
    const evt = wh.verify(
      await req.text(),
      {
        'svix-id': headerPayload.get('svix-id'),
        'svix-timestamp': headerPayload.get('svix-timestamp'),
        'svix-signature': headerPayload.get('svix-signature'),
      }
    );

    const { id, first_name, last_name, image_url, email_addresses } = evt.data;
    const eventType = evt.type;

    // Debug: Log raw event
    console.log('Webhook Event:', JSON.stringify(evt, null, 2));

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );

      // Debug: Log created user
      console.log('MongoDB User:', JSON.stringify(user, null, 2));

      if (user && eventType === 'user.created') {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: { userMongoId: user._id.toString() } // Ensure string
        });
      }
      return new Response('User processed', { status: 200 });
    }

    if (eventType === 'user.deleted') {
      await deleteUser(id);
      return new Response('User deleted', { status: 200 });
    }

    return new Response('Unhandled event type', { status: 400 });
    
  } catch (err) {
    console.error('Webhook Error:', err);
    return new Response(err.message, { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}