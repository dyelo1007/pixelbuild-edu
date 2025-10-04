import mongoose, { Document, Schema } from "mongoose";

interface ISpecs {
  [key: string]: string;
}

export interface IComponent extends Document {
  name: string;
  type: "CPU" | "Motherboard" | "RAM" | "GPU" | "Storage" | "PSU" | "Cooler";
  tier: "Entry-Level" | "Mid-Range" | "High-End";
  specs: ISpecs;
}

const componentSchema = new Schema<IComponent>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["CPU", "Motherboard", "RAM", "GPU", "Storage", "PSU", "Cooler"],
      required: true,
    },
    tier: {
      type: String,
      enum: ["Entry-Level", "Mid-Range", "High-End"],
      required: true,
    },
    specs: { type: Schema.Types.Mixed, default: {} }, // Using Mixed for flexibility
  },
  { timestamps: true }
);

const Component = mongoose.model<IComponent>("Component", componentSchema);
export default Component;
