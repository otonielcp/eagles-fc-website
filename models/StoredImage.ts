import mongoose, { Schema, Document } from "mongoose";

/**
 * Images uploaded from the admin (team photos, sponsor logos). The club does
 * not use Cloudinary, so the bytes live in the database and are served by
 * app/api/images/[id]/route.ts. Kept in their own collection so listing teams
 * never loads image bytes.
 */
export interface IStoredImage extends Document {
  data: Buffer;
  mimeType: string;
  size: number;
  createdAt: Date;
}

const StoredImageSchema: Schema = new Schema(
  {
    data: { type: Buffer, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.StoredImage ||
  mongoose.model<IStoredImage>("StoredImage", StoredImageSchema);
