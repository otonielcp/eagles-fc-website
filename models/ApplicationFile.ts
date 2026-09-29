import mongoose, { Schema, Document } from "mongoose";

/**
 * Uploaded resumes, kept in their own collection so listing applications never
 * loads file bytes. Stored in the database rather than on the CDN because a
 * resume is personal data: it must only be reachable through the admin-only
 * download route, never through a public URL.
 */
export interface IApplicationFile extends Document {
  data: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

const ApplicationFileSchema: Schema = new Schema(
  {
    data: { type: Buffer, required: true },
    fileName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.ApplicationFile ||
  mongoose.model<IApplicationFile>("ApplicationFile", ApplicationFileSchema);
