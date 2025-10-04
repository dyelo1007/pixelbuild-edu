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

export interface IComponent {
  _id: string;
  name: string;
  type: ComponentType;
  tier: ComponentTier;
  specs: ISpecs;
  createdAt?: string;
  updatedAt?: string;
}

// This type is used when creating/updating a component via the API
export type ComponentPayload = Omit<
  IComponent,
  "_id" | "createdAt" | "updatedAt"
>;
