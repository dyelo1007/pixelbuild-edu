import type { IComponent } from "./component.types";

export interface IPuzzle {
  _id: string;
  title: string;
  description: string;
  visible: boolean;
  lockedComponents: { [key: string]: IComponent };
  slotsToFill: string[];
  componentPalette: IComponent[];
  solution: { [key: string]: IComponent };
  createdAt?: string;
  updatedAt?: string;
}

export interface PuzzlePayload {
  title: string;
  description: string;
  visible: boolean;
  lockedComponents: { [key: string]: string };
  slotsToFill: string[];
  componentPalette: string[];
  solution: { [key: string]: string };
}
