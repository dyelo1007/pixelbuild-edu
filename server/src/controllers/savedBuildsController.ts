// controllers/savedBuildController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import SavedBuild from "../models/SavedBuild";
import { generateReviewForBuild } from "../services/reviewGeneratorService";
import ReviewSet from "../models/ReviewSet";

export const saveBuild = async (req: Request, res: Response) => {
  try {
    // console.log("📥 Incoming Save Build Request");
    // console.log("User from middleware:", req.user);
    // console.log("Request body:", req.body);

    if (!req.user) {
      return res.status(401).json({ message: "No user found in request" });
    }

    const { parts, name } = req.body;

    //  NEW: Add validation to ensure a name is provided
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Build name is required." });
    }

    const mappedParts: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(parts)) {
      if (Array.isArray(value) && value.length > 0) {
        mappedParts[key] = value[0];
      } else if (typeof value === "string" && value.trim() !== "") {
        mappedParts[key] = value;
      }
    }

    const newBuild = new SavedBuild({
      user: req.user._id,
      name: name.trim(), // ✨ Use the validated name, remove fallback
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

// @desc Get a single build by ID (populated)
export const getBuildById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No user found in request" });
    }

    const build = await SavedBuild.findOne({
      _id: req.params.id,
      user: req.user,
    })
      .populate("parts.case")
      .populate("parts.motherboard")
      .populate("parts.processor")
      .populate("parts.gpu")
      .populate("parts.ram")
      .populate("parts.storage")
      .populate("parts.psu")
      .populate("parts.cooler");
    // console.log(JSON.stringify(build, null, 2));
    if (!build) return res.status(404).json({ message: "Build not found" });
    return res.json(build);
  } catch (err) {
    console.error("❌ Error fetching build by id:", err);
    return res
      .status(500)
      .json({ message: "Error fetching build", error: err });
  }
};

// DELETE a saved build
export const deleteBuild = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await SavedBuild.findOneAndDelete({
      _id: req.params.id,
      user: req.user, // ensure users can only delete their own build
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Build not found or not owned by user" });
    }

    res
      .status(200)
      .json({ message: "Build deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("❌ Error deleting build:", err);
    res.status(500).json({ message: "Error deleting build", error: err });
  }
};

//UPDATE
export const updateBuild = async (req: Request, res: Response) => {
  try {
    // console.log("Updating build:", req.params.id, "for user:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { parts, name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Build name is required." });
    }

    const mappedParts: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(parts)) {
      if (Array.isArray(value) && value.length > 0) {
        mappedParts[key] = value[0];
      } else if (typeof value === "string" && value.trim() !== "") {
        mappedParts[key] = value;
      }
    }

    const updatedBuild = await SavedBuild.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { name: name.trim(), parts: mappedParts },
      { new: true }
    )
      .populate("parts.case")
      .populate("parts.motherboard")
      .populate("parts.processor")
      .populate("parts.gpu")
      .populate("parts.ram")
      .populate("parts.storage")
      .populate("parts.psu")
      .populate("parts.cooler");

    if (!updatedBuild) {
      return res
        .status(404)
        .json({ message: "Build not found or not owned by user" });
    }

    return res.json(updatedBuild);
  } catch (err) {
    console.error("❌ Error updating build:", err);
    return res
      .status(500)
      .json({ message: "Error updating build", error: err });
  }
};
// ✨ ADD THIS NEW FUNCTION TO THE END OF THE FILE (Corrected Version)
export const generateOrUpdateReviewSet = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✨ THIS IS THE PART TO REPLACE
    const build = await SavedBuild.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("parts.case")
      .populate("parts.motherboard")
      .populate("parts.processor")
      .populate("parts.gpu")
      .populate("parts.ram")
      .populate("parts.storage")
      .populate("parts.psu")
      .populate("parts.cooler");

    if (!build) {
      return res.status(404).json({ message: "Build not found" });
    }

    const newCards = await generateReviewForBuild(build);

    if (newCards.length === 0) {
      return res
        .status(400)
        .json({ message: "Cannot generate a review set for an empty build." });
    }

    const reviewSet = await ReviewSet.findOneAndUpdate(
      { build: build._id },
      {
        user: req.user._id, // ✅ This now correctly matches your schema's "user" field
        title: `Review for: ${build.name}`,
        cards: newCards,
        build: build._id,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res
      .status(200)
      .json({ message: "Review set generated successfully!", reviewSet });
  } catch (err) {
    console.error("❌ Error in generateOrUpdateReviewSet:", err);
    res
      .status(500)
      .json({ message: "Failed to generate review set", error: err });
  }
};
