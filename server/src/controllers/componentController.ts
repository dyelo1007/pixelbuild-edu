import { Request, Response } from "express";
import Part, { IPart } from "../models/Parts";


// GET /api/components - Fetches all components, sorted for readability
export const getAllComponents = async (req: Request, res: Response) => {
  try {
    const components = await Part.find().sort({ category: 1, name: 1 });
    res.json(components);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /api/components - Creates a new component
export const createComponent = async (req: Request, res: Response) => {
  try {
    const newComponent = new Part(req.body);
    await newComponent.save();
    res.status(201).json(newComponent);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error creating component", error: err.message });
  }
};

// PUT /api/components/:id - Updates an existing component
export const updateComponent = async (req: Request, res: Response) => {
  try {
    const { _id, ...updateData } = req.body; // 🧹 remove _id from update body

    const updated = await Part.findOneAndUpdate(
      { _id: req.params.id },
      updateData, // use cleaned payload
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Update error:", error);
    res.status(400).json({ message: "Error updating component", error: error.message });
  }
};



// DELETE /api/components/:id - Deletes a component
export const deleteComponent = async (req: Request, res: Response) => {
  try {
    const deleted = await Part.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Component not found" });
    }
    res.json({ message: "Component deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
