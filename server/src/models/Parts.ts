import { Schema, model, Document } from "mongoose";

export interface IPart extends Document {
  _id: string;
  name: string;
  category: string;
  brand?: string;       
  modelName?: string;   
  price?: number;      
  tier: "Entry-Level" | "Mid-Range" | "High-End";
  specs?: {
    form_factor?: string;
    socket?: string;
    tdp?: number;
    ddr?: string;
    ddr_speed?: number;
    wattage?: number;
    required_psu?: number;
    image_url?: string;
    supported_sockets?: string[];
    cooler_tdp?: number;
    capacity?: string;
    type?: string
  };
}

const PartSchema = new Schema<IPart>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },     
    modelName: { type: String },  
    price: { type: Number },
    tier: {
      type: String,
      enum: ["Entry-Level", "Mid-Range", "High-End"],
      default: "Entry-Level",
    },
    specs: {
      form_factor: { type: String },
      socket: { type: String },
      tdp: { type: Number },
      ddr: { type: String },
      ddr_speed: { type: Number },
      speed: { type: Number },
      wattage: { type: Number },
      required_psu: { type: Number },
      image_url: { type: String },
      supported_sockets: { type: [String], default: undefined },
      cooler_tdp: { type: Number },
      capacity: {type: String},
      type: {type: String}
    },
  },
  { timestamps: true }
);

const Part = model<IPart>("Part", PartSchema);
export default Part;
