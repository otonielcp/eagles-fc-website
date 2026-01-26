import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Slider from "@/models/Slider";

export const dynamic = "force-dynamic";

function formatMatchDate(value: unknown): string {
  try {
    if (value == null || value === "") return "";
    if (value instanceof Date) return value.toISOString().slice(0, 16);
    if (typeof value === "string") {
      if (value.includes("T")) return value.slice(0, 16);
      const d = new Date(value);
      return !isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : value;
    }
    return String(value);
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    await connectDB();
    const raw = await Slider.find({}).sort({ order: 1 });
    const list = JSON.parse(JSON.stringify(raw)) as any[];

    for (const s of list) {
      try {
        if (s?.gameData?.matchDate != null) {
          s.gameData.matchDate = formatMatchDate(s.gameData.matchDate);
        }
      } catch (_) {}
    }

    return NextResponse.json(list, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (e: any) {
    console.error("[GET /api/sliders]", e?.message ?? e);
    return NextResponse.json([], {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
