import { Request, Response } from "express";
import Parts, { IPart } from "../models/Parts";



// Get all parts (with optional category filter)
export const getAllParts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    const parts = await Parts.find(filter);
    return res.status(200).json(parts);
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch parts", error: err });
  }
};

// Get part by ID
export const getPartById = async (req: Request, res: Response) => {
  try {
    const part = await Parts.findById(req.params.id);
    if (!part) return res.status(404).json({ message: "Part not found" });

    return res.status(200).json(part);
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch part", error: err });
  }
};
