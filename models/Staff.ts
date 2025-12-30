import mongoose, { Schema, Document } from "mongoose";

export interface IStaff extends Document {
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  dateOfBirth: Date;
  nationality: string;
  biography: string;
  image: string;
  teamId: mongoose.Types.ObjectId;
  isActive: boolean;
  order: number;
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide staff member's first name"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide staff member's last name"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    displayName: {
      type: String,
      required: [true, "Please provide staff member's display name"],
      trim: true,
      maxlength: [50, "Display name cannot be more than 50 characters"],
    },
    role: {
      type: String,
      required: [true, "Please provide staff member's role"],
      enum: [
        "Head Coach", 
        "Assistant Coach", 
        "Goalkeeper Coach", 
        "Fitness Coach", 
        "Team Manager", 
        "Physiotherapist", 
        "Doctor", 
        "Analyst", 
        "Director", 
        "Other"
      ],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide staff member's date of birth"],
    },
    nationality: {
      type: String,
      required: [true, "Please provide staff member's nationality"],
      trim: true,
    },
    biography: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Please provide a team ID"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    socialMedia: {
      instagram: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Staff || mongoose.model<IStaff>("Staff", StaffSchema); 