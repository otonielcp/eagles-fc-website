import mongoose, { Schema, Document } from "mongoose";

export interface IPartnershipInquiry extends Document {
  firstName: string;
  lastName: string;
  title: string;
  businessName: string;
  businessWebsite: string;
  email: string;
  phone: string;
  description: string;
  status: "new" | "contacted" | "in_progress" | "closed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartnershipInquirySchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    businessWebsite: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "closed"],
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

export default mongoose.models.PartnershipInquiry ||
  mongoose.model<IPartnershipInquiry>("PartnershipInquiry", PartnershipInquirySchema);
