import mongoose from 'mongoose';

const options = {
  dbName: 'next-real-estate',
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  // Remove TLS/directConnection - Railway's proxy handles this
};

let cached = global.mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(process.env.MONGODB_URI, options)
      .then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  console.log('✅ MongoDB Connected via Railway');
  return cached.conn;
}