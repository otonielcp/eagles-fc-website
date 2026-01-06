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
  if (cached.conn) {
    // Check if the connection is still alive
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    } else {
      // Connection is not ready, reset cache
      cached.conn = null;
    }
  }
  
  // Only check for MONGODB_URI when actually connecting (at runtime, not during build)
  const MONGODB_URI = getMongoUri();
  
  try {
    cached.conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    
    console.log("MongoDB connected successfully");
    return cached.conn;
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    cached.conn = null;
    
    // Provide more specific error messages
    if (error.message?.includes('ENOTFOUND') || error.message?.includes('ECONNREFUSED')) {
      throw new Error("Connection failed. If the problem persists, please check your internet connection or VPN");
    } else if (error.message?.includes('authentication failed')) {
      throw new Error("Database authentication failed. Please check your credentials.");
    } else if (error.message?.includes('timeout')) {
      throw new Error("Connection timeout. Please check your internet connection or try again later.");
    } else {
      throw new Error(`Database connection failed: ${error.message || 'Unknown error'}`);
    }
  }
};

export default connectDB;
