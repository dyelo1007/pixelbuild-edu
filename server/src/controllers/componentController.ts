import { Request, Response } from "express";
import Component from "../models/Component";

// GET /api/components - Fetches all components, sorted for readability
export const getAllComponents = async (req: Request, res: Response) => {
  try {
    const components = await Component.find().sort({ type: 1, name: 1 });
    res.json(components);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /api/components - Creates a new component
export const createComponent = async (req: Request, res: Response) => {
  try {
    const newComponent = new Component(req.body);
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
    const updated = await Component.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Component not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error updating component", error: err.message });
  }
};

// DELETE /api/components/:id - Deletes a component
export const deleteComponent = async (req: Request, res: Response) => {
  try {
    const deleted = await Component.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Component not found" });
    }
    res.json({ message: "Component deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
