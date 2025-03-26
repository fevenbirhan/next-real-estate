import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

// Use global object to store the connection
let cached = global.mongoose || { conn: null, promise: null };

export const connect = async () => {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "next-real-estate",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB Connection Error:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
};


// import mongoose from 'mongoose';
 
//  let initialized = false;
 
// export const connect = async () => {
//    mongoose.set('strictQuery', true);
 
//    if (initialized) {
//      console.log('MongoDB already connected');
//      return;
//    }
 
//    try {
//      await mongoose.connect(process.env.MONGODB_URI, {
//        dbName: 'next-estate',
//        useNewUrlParser: true,
//        useUnifiedTopology: true,
//      });
//      initialized = true;
//      console.log('MongoDB connected');
//    } catch (error) {
//      console.log('MongoDB connection error:', error);
//    }
// };

