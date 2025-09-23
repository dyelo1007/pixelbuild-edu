// controllers/savedBuildController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import SavedBuild from "../models/SavedBuild";

/// @desc Save a new build
export const saveBuild = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming Save Build Request");
    console.log("User from middleware:", req.user);
    console.log("Request body:", req.body);

    if (!req.user) {
      return res.status(401).json({ message: "No user found in request" });
    }

    const { parts, name } = req.body;

    // ✅ Just take the first entry from each array (keep as string)
const mappedParts: Record<string, string | undefined> = {};
for (const [key, value] of Object.entries(parts)) {
  if (Array.isArray(value) && value.length > 0) {
    mappedParts[key] = value[0];  // first element
  } else if (typeof value === "string" && value.trim() !== "") {
    mappedParts[key] = value;     // direct string
  }
}

    const newBuild = new SavedBuild({
      user: req.user._id || req.user.id || req.user, // ✅ use plain string/id
      name: name || "My Build",
      parts: mappedParts,
    });

    await newBuild.save();
    res.status(201).json(newBuild);
  } catch (err) {
    console.error("❌ Error saving build:", err);
    res.status(500).json({ message: "Error saving build", error: err });
  }
};


// @desc Get all builds for logged in user
export const getUserBuilds = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No user found in request" });
    }

    const builds = await SavedBuild.find({ user: req.user })
      .populate("parts.case")
      .populate("parts.motherboard")
      .populate("parts.processor")
      .populate("parts.gpu")
      .populate("parts.ram")
      .populate("parts.storage")
      .populate("parts.psu")
      .populate("parts.cooler");

    res.json(builds);
  } catch (err) {
    console.error("❌ Error fetching builds:", err);
    res.status(500).json({ message: "Error fetching builds", error: err });
  }
};
