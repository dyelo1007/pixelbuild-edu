import { Schema, model, Document } from "mongoose";

export interface IPart extends Document {
  _id: string;
  name: string;
  category: string;
  brand: string;
  modelName: string;
  price: number;

  specs?: {
    // existing
    form_factor?: string;
    socket?: string;              // CPU socket or single-socket cooler
    tdp?: number;
    ddr?: string;
    ddr_speed?: number;
    wattage?: number;
    required_psu?: number;
    image_url?: string;

    // ✅ NEW (for coolers)
    supported_sockets?: string[]; // e.g. ["AM5","LGA1700"]
    cooler_tdp?: number;          // cooler’s rated TDP in watts
  };
}

const PartSchema = new Schema<IPart>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    modelName: { type: String, required: true },
    price: { type: Number, required: true },

    specs: {
      form_factor: { type: String },
      socket: { type: String },
      tdp: { type: Number },
      ddr: { type: String },
      ddr_speed: { type: Number },
      wattage: { type: Number },
      required_psu: { type: Number },
      image_url: { type: String },

      // ✅ NEW
      supported_sockets: { type: [String], default: undefined },
      cooler_tdp: { type: Number },
    },
  },
  { timestamps: true }
);

const Part = model<IPart>("Part", PartSchema);
export default Part;
