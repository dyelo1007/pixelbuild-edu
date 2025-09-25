import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

interface IFlashcard extends Document {
  question: string;
  answer: string;
}

export interface IReviewSet extends Document {
  title: string;
  studentId: IUser["_id"];
  cards: IFlashcard[];
}

const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const reviewSetSchema = new Schema<IReviewSet>(
  {
    title: { type: String, required: true, trim: true },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cards: [flashcardSchema],
  },
  { timestamps: true }
);

const ReviewSet = mongoose.model<IReviewSet>("ReviewSet", reviewSetSchema);
export default ReviewSet;
