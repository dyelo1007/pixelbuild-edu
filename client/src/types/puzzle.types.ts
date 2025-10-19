import type { IPart } from "./component.types";

export interface IPuzzle {
  _id: string;
  title: string;
  description: string;
  visible: boolean;
  lockedComponents: { [key: string]: IPart };
  slotsToFill: string[];
  componentPalette: IPart[];
  solution: { [key: string]: IPart };
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
