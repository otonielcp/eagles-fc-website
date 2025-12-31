/* eslint-disable no-var */
import mongoose from "mongoose";
import { Mongoose } from "mongoose";

declare global {
  var mongoose: {
    conn: Mongoose | null;
  };
}

// Lazy initialization - only check for MONGODB_URI when connectDB is called, not at module load
function getMongoUri(): string {
  const MONGODB_URI = process.env.MONGO_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI (MONGO_URI) environment variable is not defined. Please set it in your Vercel environment variables.");
  }
  return MONGODB_URI;
}

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  
  // Only check for MONGODB_URI when actually connecting (at runtime, not during build)
  const MONGODB_URI = getMongoUri();
  
  cached.conn = await mongoose
    .connect(MONGODB_URI)
    .then((mongoose) => {      
      return mongoose;
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB", error);
      return null;
    });

  return cached.conn;
};

export default connectDB;
