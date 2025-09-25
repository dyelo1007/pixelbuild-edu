import { Request, Response } from "express";
import ReviewSet from "../models/ReviewSet";

// GET
export const getMySets = async (req: Request, res: Response) => {
  try {
    const sets = await ReviewSet.find({ studentId: req.user?._id }).sort({
      updatedAt: -1,
    });
    res.json(sets);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// POST
export const createSet = async (req: Request, res: Response) => {
  try {
    const { title, cards } = req.body;
    const newSet = new ReviewSet({
      title,
      cards,
      studentId: req.user?._id,
    });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error creating set", error: error.message });
  }
};

// GET
export const getSetById = async (req: Request, res: Response) => {
  try {
    const set = await ReviewSet.findOne({
      _id: req.params.id,
      studentId: req.user?._id,
    });
    if (!set) {
      return res.status(404).json({
        message:
          "Review set not found or you do not have permission to view it.",
      });
    }
    res.json(set);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PUT
export const updateSet = async (req: Request, res: Response) => {
  try {
    const { title, cards } = req.body;
    const updatedSet = await ReviewSet.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user?._id },
      { title, cards },
      { new: true }
    );
    if (!updatedSet) {
      return res.status(404).json({
        message:
          "Review set not found or you do not have permission to edit it.",
      });
    }
    res.json(updatedSet);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error updating set", error: error.message });
  }
};

// DELETE
export const deleteSet = async (req: Request, res: Response) => {
  try {
    const deletedSet = await ReviewSet.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user?._id,
    });
    if (!deletedSet) {
      return res.status(404).json({
        message:
          "Review set not found or you do not have permission to delete it.",
      });
    }
    res.json({ message: "Review set deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
