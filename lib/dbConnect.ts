/* eslint-disable no-var */
import mongoose from "mongoose";
import { Mongoose } from "mongoose";

declare global {
  var mongoose: {
    conn: Mongoose | null;
  };
}

const DEFAULT_DB = "eagles-fc";

// Lazy initialization - only check for MONGODB_URI when connectDB is called, not at module load
function getMongoUri(): string {
  let uri = process.env.MONGO_URI;
  if (!uri || !uri.trim()) {
    throw new Error("MONGO_URI environment variable is not defined. Set it in Vercel (Production/Preview/Development) and in .env locally.");
  }
  uri = uri.trim();
  // Ensure we use the eagles-fc database. URI must be .../host.net/ or .../host.net
  const match = uri.match(/^(.+\.mongodb\.net)(\/[^/?]*)?(\?.*)?$/);
  if (match) {
    const base = match[1];
    const db = match[2]; // e.g. /eagles-fc or undefined
    const qs = match[3] || "";
    if (!db || db === "/") {
      return `${base}/${DEFAULT_DB}${qs ? qs : "?retryWrites=true&w=majority"}`;
    }
  }
  return uri;
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
