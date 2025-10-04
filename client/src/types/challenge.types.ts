import type { IPuzzle } from "./puzzle.types";

export interface IChallenge {
  _id: string;
  title: string;
  description: string;
  puzzles: IPuzzle[];
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}
