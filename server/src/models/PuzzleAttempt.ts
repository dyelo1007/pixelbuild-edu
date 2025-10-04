import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IPuzzle } from "./Puzzle";

export interface IPuzzleAttempt extends Document {
  puzzleId: IPuzzle["_id"];
  studentId: IUser["_id"];
  build: { [key: string]: string }; // Stores the component IDs the user placed
  score: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const puzzleAttemptSchema = new Schema<IPuzzleAttempt>(
  {
    puzzleId: { type: Schema.Types.ObjectId, ref: "Puzzle", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    build: { type: Map, of: String },
    score: { type: Number, required: true },
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// A student can only attempt each puzzle once
puzzleAttemptSchema.index({ puzzleId: 1, studentId: 1 }, { unique: true });

const PuzzleAttempt = mongoose.model<IPuzzleAttempt>(
  "PuzzleAttempt",
  puzzleAttemptSchema
);
export default PuzzleAttempt;
