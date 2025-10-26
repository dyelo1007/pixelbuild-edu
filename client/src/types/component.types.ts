export type ComponentType =
  | "CPU"
  | "Motherboard"
  | "RAM"
  | "GPU"
  | "Storage"
  | "PSU"
  | "Cooler";

export type ComponentTier = "Entry-Level" | "Mid-Range" | "High-End";

export interface ISpecs {
  [key: string]: string;
}

export interface IPart {
  _id: string;
  name: string;
  category: ComponentType; // e.g., "CPU", "GPU", etc.
  brand?: string;
  modelName?: string;
  tier: ComponentTier;
  specs: ISpecs; // detailed specs like socket, DDR, etc.
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Used when sending or updating components/parts to the API
export type PartPayload = Omit<IPart, "createdAt" | "updatedAt"> & {
  _id?: string;
};
