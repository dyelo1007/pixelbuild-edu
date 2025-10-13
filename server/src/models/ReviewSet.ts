import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IFlashcard extends Document {
  question: string;
  answer: string;
}

export interface IReviewSet extends Document {
  title: string;
  user: mongoose.Types.ObjectId;
  cards: {
    _id?: mongoose.Types.ObjectId;
    question: string;
    answer: string;
  }[];
  build?: mongoose.Types.ObjectId;
}

const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const reviewSetSchema = new Schema<IReviewSet>(
  {
    title: { type: String, required: true, trim: true },
    user: {
      // ✨ Changed from studentId to user
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cards: [flashcardSchema],
    build: {
      type: Schema.Types.ObjectId,
      ref: "SavedBuild",
      unique: true, // Ensures one build can only have one auto-generated set
      sparse: true, // Allows null values so it doesn't conflict with manual sets
    },
  },
  { timestamps: true }
);

const ReviewSet = mongoose.model<IReviewSet>("ReviewSet", reviewSetSchema);
export default ReviewSet;
