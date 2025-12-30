import mongoose from "mongoose";
const leagueCountSchema = new mongoose.Schema({
  league: {
    type: String,
    required: true,
    enum: ['Tournament', 'NYSL'], // restrict to only these two leagues
    unique: true, // one entry per league
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.LeagueCount || mongoose.model("LeagueCount", leagueCountSchema); 