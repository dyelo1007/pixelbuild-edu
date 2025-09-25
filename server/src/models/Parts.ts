import { Schema, model, Document } from "mongoose";

export interface IPart extends Document {
  _id: string;      
  name: string;
  category: string;
  brand: string;
  modelName: string;   // changed to avoid conflict
  chipset?: string;
  socket?: string;
  ddr?: string;
  price: number;
  formFactor?: string;
}

const PartSchema = new Schema<IPart>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    modelName: { type: String, required: true }, // changed here too
    chipset: { type: String },
    socket: { type: String },
    ddr: { type: String },
    formFactor: { type: String }, 
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Part = model<IPart>("Part", PartSchema);

export default Part;
