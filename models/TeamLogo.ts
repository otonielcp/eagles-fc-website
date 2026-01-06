import mongoose, { Schema, Document } from "mongoose";

export interface ITeamLogo extends Document {
  name: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamLogoSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a team name"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: [true, "Please provide a logo URL"],
    },
  },
  { timestamps: true }
);

// Create index for fast name lookups
TeamLogoSchema.index({ name: 1 });

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.TeamLogo || mongoose.model<ITeamLogo>("TeamLogo", TeamLogoSchema);
