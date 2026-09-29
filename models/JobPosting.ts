import mongoose, { Schema, Document } from "mongoose";

export interface IJobPosting extends Document {
  title: string;
  slug: string;
  department: "coaching" | "administration";
  employmentType: "full_time" | "part_time" | "seasonal" | "volunteer" | "contract";
  location: string;
  team: string;
  compensation: string;
  startDate: string;
  applicationDeadline: string; // YYYY-MM-DD in club time, "" for none
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  benefits: string[];
  status: "draft" | "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const JobPostingSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      enum: ["coaching", "administration"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["full_time", "part_time", "seasonal", "volunteer", "contract"],
      default: "part_time",
    },
    location: { type: String, trim: true, default: "Grand Island, NE" },
    team: { type: String, trim: true, default: "" },
    compensation: { type: String, trim: true, default: "" },
    startDate: { type: String, trim: true, default: "" },
    applicationDeadline: { type: String, trim: true, default: "" },
    summary: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    preferred: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

JobPostingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.JobPosting ||
  mongoose.model<IJobPosting>("JobPosting", JobPostingSchema);
