// models/SavedBuild.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISavedBuild extends Document {
  user: mongoose.Types.ObjectId;   // keep user as ObjectId
  name: string;
  parts: {
    case?: string;
    motherboard?: string;
    processor?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    psu?: string;
    cooler?: string;
  };
  createdAt: Date;
}

const SavedBuildSchema = new Schema<ISavedBuild>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "My Build" },
  parts: {
    case: { type: String, ref: "Part" },
    motherboard: { type: String, ref: "Part" },
    processor: { type: String, ref: "Part" },
    gpu: { type: String, ref: "Part" },
    ram: { type: String, ref: "Part" },
    storage: { type: String, ref: "Part" },
    psu: { type: String, ref: "Part" },
    cooler: { type: String, ref: "Part" },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISavedBuild>("SavedBuild", SavedBuildSchema);
