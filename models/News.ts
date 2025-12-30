import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a news title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide news content"],
    },
    summary: {
      type: String,
      required: [true, "Please provide a news summary"],
      // maxlength: [500, "Summary cannot be more than 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide a news image"],
    },
    author: {
      type: String,
      required: [true, "Please provide an author name"],
      default: "Eagles FC Staff",
    },
    category: {
      type: String,
      required: [true, "Please provide a news category"],
      enum: ["News", "Match Coverage", "Interviews", "Club Updates", "Community", "Announcements"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema); 