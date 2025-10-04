import mongoose, { Document, Schema } from "mongoose";
import { IPuzzle } from "./Puzzle";

export interface IChallenge extends Document {
  title: string;
  description: string;
  puzzles: IPuzzle["_id"][];
  visible: boolean;
}

const challengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    puzzles: [{ type: Schema.Types.ObjectId, ref: "Puzzle" }],
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Challenge = mongoose.model<IChallenge>("Challenge", challengeSchema);
export default Challenge;
