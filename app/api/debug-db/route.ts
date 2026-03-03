import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Try listing collections
    const db = mongoose.connection.db;
    const collections = db
      ? await db.listCollections().toArray()
      : [];

    return NextResponse.json({
      status: "ok",
      connectionState: stateMap[state] || "unknown",
      database: db?.databaseName || "unknown",
      collections: collections.map((c) => c.name),
      mongoUri: process.env.MONGO_URI ? "SET" : "NOT SET",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Unknown error",
        mongoUri: process.env.MONGO_URI ? "SET" : "NOT SET",
      },
      { status: 500 }
    );
  }
}
