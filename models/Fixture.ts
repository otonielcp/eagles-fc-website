import mongoose, { Schema, Document } from "mongoose";

// Timeline event interface
export interface ITimelineEvent {
  time: string;
  type: string;
  team: string;
  player?: string;
  assistedBy?: string;
  description?: string;
}

// Fixture interface
export interface IFixture extends Document {
  date: string;
  time: string;
  stadium: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  competitionLogo: string;
  broadcastLogo?: string;
  status: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema = new Schema({
  time: { type: String, required: true },
  type: { type: String, required: true },
  team: { type: String, required: true },
  player: { type: String },
  assistedBy: { type: String },
  description: { type: String },
});

const FixtureSchema: Schema = new Schema(
  {
    date: {
      type: String,
      required: [true, "Please provide match date"],
    },
    time: {
      type: String,
      required: [true, "Please provide match time"],
    },
    stadium: {
      type: String,
      required: [true, "Please provide stadium name"],
    },
    competition: {
      type: String,
      required: [true, "Please provide competition name"],
    },
    competitionType: {
      type: String,
      required: [true, "Please provide competitionType name"],
    },
    homeTeam: {
      type: String,
      required: [true, "Please provide home team name"],
    },
    awayTeam: {
      type: String,
      required: [true, "Please provide away team name"],
    },
    homeTeamLogo: {
      type: String,
      default: "/teams/ventura.png",
    },
    awayTeamLogo: {
      type: String,
      default: "/teams/ventura.png",
    },
    leagueLogo: {
      type: String,
      default: "/logo.png",
    },
    channelLogo: {
      type: String,
      default: "/teams/ventura.png",
    },
    matchReport: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "FT", "POSTPONED", "CANCELLED"],
      default: "SCHEDULED",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    timeline: {
      type: [TimelineEventSchema],
      default: [],
    },
    homeScore: {
      type: Number,
      default: 0,
    },
    awayScore: {
      type: Number,
      default: 0,
    },
    matchImage: {
      type: String,
      default: "/gameresultbg.jpeg",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Fixture ||
  mongoose.model<IFixture>("Fixture", FixtureSchema);
