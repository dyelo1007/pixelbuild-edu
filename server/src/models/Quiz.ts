import mongoose, { Schema, Document } from "mongoose";

interface IQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface IQuiz extends Document {
  title: string;
  questions: IQuestion[];
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
  visible: { type: Boolean, default: true },
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
