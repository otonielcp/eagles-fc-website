import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/dbConnect";
import StoredImage from "@/models/StoredImage";
import { STORED_IMAGE_TYPES } from "@/lib/imageStore";

// Serves admin-uploaded images (team photos, sponsor logos) from MongoDB.
// An image's bytes never change after upload (a replacement gets a new id),
// so responses can be cached for a long time.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    await connectDB();
    const image = await StoredImage.findById(id);
    if (!image || !STORED_IMAGE_TYPES.includes(image.mimeType)) {
      return new Response("Not found", { status: 404 });
    }

    const bytes = Buffer.from(image.data);
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  } catch (error) {
    console.error("[GET /api/images] failed:", error);
    return new Response("Error", { status: 500 });
  }
}
