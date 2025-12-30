import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  shortName: string;
  description: string;
  category: string;
  image: string;
  isActive: boolean;
  order: number;
  sponsor: {
    name: string;
    logo: string;
    website: string;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a team name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
      unique: true,
    },
    shortName: {
      type: String,
      required: [true, "Please provide a short name"],
      trim: true,
      maxlength: [20, "Short name cannot be more than 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a team description"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      default: "Senior",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    sponsor: {
      name: {
        type: String,
        default: "",
      },
      logo: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema); 