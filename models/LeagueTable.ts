import mongoose, { Schema, Document } from "mongoose";

export interface ILeagueTable extends Document {
  competition: string;
  seasonYear: string;
  club: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: string;
  points: number;
  form: string[];
  clubLogo: string;
  updatedAt: Date;
}

const LeagueTableSchema: Schema = new Schema(
  {
    competition: {
      type: String,
      required: [true, "Please provide competition name"],
      trim: true
    },
    seasonYear: {
      type: String,
      required: [true, "Please provide season year"],
      trim: true
    },
    club: {
      type: String,
      required: [true, "Please provide club name"],
      trim: true
    },
    position: {
      type: Number,
      required: [true, "Please provide position"]
    },
    played: {
      type: Number,
      default: 0
    },
    won: {
      type: Number,
      default: 0
    },
    drawn: {
      type: Number,
      default: 0
    },
    lost: {
      type: Number,
      default: 0
    },
    goalsFor: {
      type: Number,
      default: 0
    },
    goalsAgainst: {
      type: Number,
      default: 0
    },
    goalDifference: {
      type: String,
      default: "0"
    },
    points: {
      type: Number,
      default: 0
    },
    form: {
      type: [String],
      default: []
    },
    clubLogo: {
      type: String,
      default: "./logo.png"
    }
  },
  { timestamps: true }
);

export default mongoose.models.LeagueTable || mongoose.model<ILeagueTable>("LeagueTable", LeagueTableSchema); 