import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a video title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a video description"],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "Please provide a video URL"],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: [true, "Please provide a thumbnail URL"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema); 