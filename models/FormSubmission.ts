import mongoose, { Schema, Document } from "mongoose";

export interface IFormSubmission extends Document {
  type: "contact" | "registration" | "operations" | "marketing" | "media";
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  data: Record<string, any>;
  status: "new" | "read" | "replied" | "closed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const FormSubmissionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["contact", "registration", "operations", "marketing", "media"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema);
