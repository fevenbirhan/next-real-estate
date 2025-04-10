export async function GET() {
    return new Response(JSON.stringify({ message: 'Pong' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}  