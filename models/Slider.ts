import mongoose, { Schema, Document } from "mongoose";

export interface IGameData {
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  leagueLogo: string;
  matchDate: Date | string;
  matchTime: string;
  matchLocation: string;
  leftPlayerImage: string;
  rightPlayerImage: string;
}

export interface ISlider extends Document {
  type: "text" | "game";
  title: string;
  content: string;
  image: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  gameData?: IGameData;
  fixtureId?: string; // Links to Fixture when created from featured match
  createdAt: Date;
  updatedAt: Date;
}

const GameDataSchema = new Schema(
  {
    homeTeamName: { type: String, default: "" },
    homeTeamLogo: { type: String, default: "" },
    awayTeamName: { type: String, default: "" },
    awayTeamLogo: { type: String, default: "" },
    leagueLogo: { type: String, default: "" },
    matchDate: { type: Date, default: null },
    matchTime: { type: String, default: "" },
    matchLocation: { type: String, default: "" },
    leftPlayerImage: { type: String, default: "" },
    rightPlayerImage: { type: String, default: "" },
  },
  { _id: false }
);

const SliderSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["text", "game"],
      default: "text",
    },
    title: {
      type: String,
      required: [true, "Please provide a slider title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: false,
      maxlength: [500, "Content cannot be more than 500 characters"],
      default: "",
    },
    image: {
      type: String,
      required: [true, "Please provide a slider image"],
    },
    link: {
      type: String,
      required: [true, "Please provide a link"],
      default: "/",
    },
    buttonText: {
      type: String,
      default: "READ MORE",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    gameData: {
      type: GameDataSchema,
      default: null,
    },
    fixtureId: {
      type: Schema.Types.ObjectId,
      ref: "Fixture",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Slider || mongoose.model<ISlider>("Slider", SliderSchema);
