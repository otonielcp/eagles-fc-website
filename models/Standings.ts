import mongoose from "mongoose";

// Define the schema for team standings
const teamSchema = new mongoose.Schema({
  clubInfo: String,
  bracketCode: String,
  teamName: String,
  totalPoints: Number,
  gamesPlayed: Number,
  wins: Number,
  losses: Number,
  ties: Number,
  goalsFor: Number,
  goalsAgainst: Number,
  goalDifference: Number,
  rank: Number,
  teamLogo: String
});

// Define the schema for standings collection
const standingSchema = new mongoose.Schema(
  {
    metadata: {
      league: String,
      group: String,
      season: String,
      lastUpdated: Date,
    },
    standings: [teamSchema],
  },
  { timestamps: true }
);

// Create and export the model
export default mongoose.models.Standing ||
  mongoose.model("Standing", standingSchema);
