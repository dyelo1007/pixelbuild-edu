// server/models/Puzzle.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPuzzle extends Document {
  title: string;
  description: string;
  visible: boolean;
  lockedComponents: Record<string, string>; // changed from Map<ObjectId> → Record<string, string>
  slotsToFill: string[];
  componentPalette: string[]; // changed from ObjectId[] → string[]
  solution: Record<string, string>; // changed from Map<ObjectId> → Record<string, string>
  createdAt: Date;
  updatedAt: Date;
}

const puzzleSchema = new Schema<IPuzzle>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    visible: { type: Boolean, default: true },

    // 🔥 Store string IDs instead of ObjectIds
    lockedComponents: {
      type: Map,
      of: { type: String, ref: "Part" },
      default: {},
    },

    slotsToFill: [{ type: String }],

    componentPalette: [{ type: String, ref: "Part" }],

    solution: {
      type: Map,
      of: { type: String, ref: "Part" },
      default: {},
    },
  },
  { timestamps: true }
);

const Puzzle = mongoose.model<IPuzzle>("Puzzle", puzzleSchema);
export default Puzzle;
