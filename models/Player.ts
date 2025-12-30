import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
  firstName: string;
  lastName: string;
  displayName: string;
  jerseyNumber: number;
  position: string;
  dateOfBirth: Date;
  nationality: string;
  height: number; // in feet
  weight: number; // in pounds
  biography: string;
  image: string;
  teamId: mongoose.Types.ObjectId;
  isActive: boolean;
  isCaptain: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutes: number;
    starts: number;
    substitutions: number;
    fouls: number;
    penalties: number;
    doubleYellowCards: number;
    shots: number;
    matchesPlayed: number;
  };
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide player's first name"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide player's last name"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    displayName: {
      type: String,
      required: [true, "Please provide player's display name"],
      trim: true,
      maxlength: [50, "Display name cannot be more than 50 characters"],
    },
    jerseyNumber: {
      type: Number,
      required: [true, "Please provide player's jersey number"],
      min: [1, "Jersey number must be at least 1"],
      max: [99, "Jersey number cannot exceed 99"],
    },
    position: {
      type: String,
      required: [true, "Please provide player's position"],
      enum: [
        "Goalkeeper",
        "Defender",
        "Midfielder",
        "Forward",
        "Center Back",
        "Full Back",
        "Wing Back",
        "Defensive Midfielder",
        "Central Midfielder",
        "Attacking Midfielder",
        "Winger",
        "Striker"
      ],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide player's date of birth"],
    },
    nationality: {
      type: String,
      required: [true, "Please provide player's nationality"],
      trim: true,
    },
    height: {
      type: String, // in cm
      default: 0,
    },
    weight: {
      type: String, // in kg
      default: 0,
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
    isCaptain: {
      type: Boolean,
      default: false,
    },
    stats: {
      appearances: {
        type: Number,
        default: 0,
      },
      goals: {
        type: Number,
        default: 0,
      },
      assists: {
        type: Number,
        default: 0,
      },
      yellowCards: {
        type: Number,
        default: 0,
      },
      redCards: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
      starts: {
        type: Number,
        default: 0,
      },
      substitutions: {
        type: Number,
        default: 0,
      },
      fouls: {
        type: Number,
        default: 0,
      },
      penalties: {
        type: Number,
        default: 0,
      },
      doubleYellowCards: {
        type: Number,
        default: 0,
      },
      shots: {
        type: Number,
        default: 0,
      },
      matchesPlayed: {
        type: Number,
        default: 0,
      },
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

// Create a compound index for team and jersey number to ensure uniqueness within a team
PlayerSchema.index({ teamId: 1, jerseyNumber: 1 }, { unique: true });

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Player || mongoose.model<IPlayer>("Player", PlayerSchema); 