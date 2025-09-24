import mongoose, { Schema, Document } from "mongoose";

export interface IQuizAttempt extends Document {
  studentId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  answers: string[];
  score: number;
  createdAt: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);
