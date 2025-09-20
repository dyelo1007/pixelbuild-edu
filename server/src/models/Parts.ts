import { Schema, model, Document } from "mongoose";

export interface IPart extends Document {
  name: string;
  type: string;
  brand: string;
  modelName: string;   // changed to avoid conflict
  chipset?: string;
  socket?: string;
  ddr?: string;
  price: number;
}

const PartSchema = new Schema<IPart>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    modelName: { type: String, required: true }, // changed here too
    chipset: { type: String },
    socket: { type: String },
    ddr: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Part = model<IPart>("Part", PartSchema);

export default Part;
