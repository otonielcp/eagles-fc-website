import mongoose, { Schema, Document } from "mongoose";

export interface ISponsorsLogo extends Document {
  name: string;
  image: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorsLogoSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a logo name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide a logo image"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      default: "Sponsor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.SponsorsLogo || mongoose.model<ISponsorsLogo>("SponsorsLogo", SponsorsLogoSchema); 