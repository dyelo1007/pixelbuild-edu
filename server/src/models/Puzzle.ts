import mongoose, { Document, Schema, Types } from "mongoose";
import { IComponent } from "./Component";

export interface IPuzzle extends Document {
  title: string;
  description: string;
  visible: boolean;
  lockedComponents: Map<string, Types.ObjectId>; // ✅ explicitly ObjectId
  slotsToFill: string[];
  componentPalette: Types.ObjectId[]; // ✅ safer than IComponent["_id"]
  solution: Map<string, Types.ObjectId>; // ✅ explicitly ObjectId
  createdAt: Date;
  updatedAt: Date;
}

const puzzleSchema = new Schema<IPuzzle>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    visible: { type: Boolean, default: true },

    lockedComponents: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Component" },
      default: {},
    },

    slotsToFill: [{ type: String }],

    componentPalette: [{ type: Schema.Types.ObjectId, ref: "Component" }],

    solution: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Component" },
      default: {},
    },
  },
  { timestamps: true }
);

const Puzzle = mongoose.model<IPuzzle>("Puzzle", puzzleSchema);
export default Puzzle;
