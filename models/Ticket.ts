import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  // Match Information
  matchName: string;
  date: string;
  time: string;
  stadium: string;

  // Team Information
  teamId: mongoose.Types.ObjectId;
  opponentName: string;
  opponentImage: string;

  // External Link
  externalTicketLink: string;

  // Additional Information
  description: string;
  sponsor: string;

  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    // Match Information
    matchName: {
      type: String,
      required: [true, "Please provide match name"],
      trim: true
    },
    date: {
      type: String,
      required: [true, "Please provide match date"],
      trim: true
    },
    time: {
      type: String,
      required: [true, "Please provide match time"],
      trim: true
    },
    stadium: {
      type: String,
      required: [true, "Please provide stadium name"],
      trim: true
    },

    // Team Information
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Please provide a team ID"]
    },
    opponentName: {
      type: String,
      required: [true, "Please provide opponent name"],
      trim: true
    },
    opponentImage: {
      type: String,
      required: [true, "Please provide opponent image"],
      trim: true
    },

    // External Link
    externalTicketLink: {
      type: String,
      required: [true, "Please provide external ticket link"],
      trim: true
    },

    // Additional Information
    description: {
      type: String,
      default: ""
    },
    sponsor: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Creating indexes for better querying
// TicketSchema.index({ date: 1 });
// TicketSchema.index({ teamId: 1 });

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema); 