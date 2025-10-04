import mongoose, { Document, Schema } from "mongoose";
import { IChallenge } from "./Challenge";
import { IUser } from "./User";

interface IPuzzleScore {
  puzzleId: mongoose.Types.ObjectId;
  score: number;
}

export interface IChallengeAttempt extends Document {
  challengeId: IChallenge["_id"];
  studentId: IUser["_id"];
  scores: IPuzzleScore[];
  totalScore: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const puzzleScoreSchema = new Schema<IPuzzleScore>({
  puzzleId: { type: Schema.Types.ObjectId, ref: "Puzzle" },
  score: { type: Number, required: true },
});

const challengeAttemptSchema = new Schema<IChallengeAttempt>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scores: [puzzleScoreSchema],
    totalScore: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A student can only attempt each challenge once
challengeAttemptSchema.index(
  { challengeId: 1, studentId: 1 },
  { unique: true }
);

const ChallengeAttempt = mongoose.model<IChallengeAttempt>(
  "ChallengeAttempt",
  challengeAttemptSchema
);
export default ChallengeAttempt;
