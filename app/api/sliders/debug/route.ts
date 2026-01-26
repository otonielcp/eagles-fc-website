import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Slider from "@/models/Slider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Test connection
    await connectDB();
    
    // Count all sliders
    const totalCount = await Slider.countDocuments({});
    
    // Count active sliders
    const activeCount = await Slider.countDocuments({ isActive: true });
    
    // Get a sample slider to verify structure
    const sample = await Slider.findOne({});
    
    // Get connection info
    const dbName = process.env.MONGO_URI?.split('/').pop()?.split('?')[0] || 'unknown';
    const hasUri = !!process.env.MONGO_URI;
    
    return NextResponse.json({
      success: true,
      connection: "OK",
      database: dbName,
      hasMongoUri: hasUri,
      mongoUriPrefix: hasUri ? process.env.MONGO_URI?.substring(0, 30) + "..." : "NOT SET",
      counts: {
        total: totalCount,
        active: activeCount,
      },
      sample: sample ? {
        _id: sample._id.toString(),
        title: sample.title,
        isActive: sample.isActive,
        type: sample.type,
      } : null,
    }, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      connection: "FAILED",
      error: error?.message || String(error),
      hasMongoUri: !!process.env.MONGO_URI,
      mongoUriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + "..." : "NOT SET",
    }, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
