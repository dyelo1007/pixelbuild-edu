import mongoose, { Document, Schema } from "mongoose";
import { IComponent } from "./Component";

export interface IPuzzle extends Document {
  title: string;
  description: string;
  visible: boolean;
  lockedComponents: Map<string, IComponent["_id"]>;
  slotsToFill: string[];
  componentPalette: IComponent["_id"][];
  solution: Map<string, IComponent["_id"]>;
}

const puzzleSchema = new Schema<IPuzzle>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    visible: { type: Boolean, default: true },
    // This schema definition correctly allows Mongoose to populate the Map
    lockedComponents: {
      type: Map,
      of: Schema.Types.ObjectId,
      ref: "Component",
    },
    slotsToFill: [{ type: String }],
    componentPalette: [{ type: Schema.Types.ObjectId, ref: "Component" }],
    solution: {
      type: Map,
      of: Schema.Types.ObjectId,
      ref: "Component",
    },
  },
  { timestamps: true }
);

const Puzzle = mongoose.model<IPuzzle>("Puzzle", puzzleSchema);
export default Puzzle;
