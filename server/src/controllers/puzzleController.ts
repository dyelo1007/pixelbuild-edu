import { Request, Response } from "express";
import Puzzle from "../models/Puzzle";
import PuzzleAttempt from "../models/PuzzleAttempt";
import { User } from "../models/User";
import Part, { IPart } from "../models/Parts";


/**
 * Hydrate lockedComponents and solution for a single puzzle doc/plain object
 */
async function hydratePuzzleMaps(puzzleDoc: any) {
  const puzzle = puzzleDoc.toObject ? puzzleDoc.toObject() : { ...puzzleDoc };
  const locked = puzzle.lockedComponents ? { ...puzzle.lockedComponents } : {};
  const lockedIds = Object.values(locked)
    .filter(Boolean)
    .map((id: any) => id.toString());
  const solutionMap = puzzle.solution ? { ...puzzle.solution } : {};
  const solutionIds = Object.values(solutionMap)
    .filter(Boolean)
    .map((id: any) => id.toString());
  const allIds = Array.from(new Set([...lockedIds, ...solutionIds]));
  const components = allIds.length
    ? await Part.find({ _id: { $in: allIds } }).lean()
    : [];
  const compById: Record<string, any> = Object.fromEntries(
    components.map((c: any) => [c._id.toString(), c])
  );

  const hydratedLocked: Record<string, any> = {};
  for (const [slot, compId] of Object.entries(locked)) {
    hydratedLocked[slot] = compById[(compId as any)?.toString()] ?? null;
  }

  const hydratedSolution: Record<string, any> = {};
  for (const [slot, compId] of Object.entries(solutionMap)) {
    hydratedSolution[slot] = compById[(compId as any)?.toString()] ?? null;
  }

  let palette = puzzle.componentPalette ?? [];
  if (palette.length && typeof palette[0] === "string") {
    const paletteDocs = await Part.find({ _id: { $in: palette } }).lean();
    const paletteById = Object.fromEntries(
      paletteDocs.map((c: any) => [c._id.toString(), c])
    );
    palette = palette.map((id: any) => paletteById[id.toString()] ?? null);
  }

  return {
    ...puzzle,
    lockedComponents: hydratedLocked,
    solution: hydratedSolution,
    componentPalette: palette,
  };
}

// GET /api/puzzles - Fetch all visible puzzles the student hasn't attempted
export const getVisiblePuzzles = async (req: Request, res: Response) => {
  try {
    const attemptedPuzzles = await PuzzleAttempt.find({
      studentId: req.user?._id,
    }).select("puzzleId");
    const attemptedPuzzleIds = attemptedPuzzles.map((a) => a.puzzleId);

    const rawPuzzles = await Puzzle.find({
      visible: true,
      _id: { $nin: attemptedPuzzleIds },
    });
    const puzzles = await Promise.all(
      rawPuzzles.map((p: any) => hydratePuzzleMaps(p))
    );
    res.json(puzzles);
  } catch (err: any) {
    console.error("Error in getVisiblePuzzles:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /api/puzzles/submit - submit a single puzzle attempt
export const submitPuzzleAttempt = async (req: Request, res: Response) => {
  try {
    const { puzzleId, build } = req.body;
    const studentId = req.user?._id;

    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });

    // Convert solution Map -> plain object of ids (string)
// ✅ Safely convert Map<string, string> to a plain object
      const solutionObject: Record<string, string> = {};

      if (puzzle.solution instanceof Map) {
        for (const [slot, compId] of puzzle.solution.entries()) {
          solutionObject[slot] = String(compId);
        }
      } else if (typeof puzzle.solution === "object" && puzzle.solution !== null) {
        Object.entries(puzzle.solution).forEach(([slot, compId]) => {
          solutionObject[slot] = String(compId);
        });
      }


    let score = 0;
    Object.entries(build).forEach(([slot, componentId]) => {
      if (
        solutionObject[slot] &&
        solutionObject[slot].toString() === componentId
      ) {
        score += 50;
      }
    });

    const attempt = new PuzzleAttempt({
      puzzleId,
      studentId,
      build,
      score,
      completed: true,
    });
    await attempt.save();
    res.status(201).json({ message: "Attempt saved!", attempt });
  } catch (err: any) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already attempted this puzzle." });
    }
    console.error("Error in submitPuzzleAttempt:", err);
    res.status(500).json({ message: "Server error while submitting attempt." });
  }
};

// --- Admin routes ---

// Fetch all puzzles (hydrated for admin)
export const getAllPuzzlesForAdmin = async (req: Request, res: Response) => {
  try {
    const rawPuzzles = await Puzzle.find().sort({ createdAt: -1 });
    const puzzles = await Promise.all(
      rawPuzzles.map((p: any) => hydratePuzzleMaps(p))
    );
    res.json(puzzles);
  } catch (err: any) {
    console.error("Error in getAllPuzzlesForAdmin:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Fetch puzzle results (with attempts)
export const getPuzzleResultsForAdmin = async (req: Request, res: Response) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id).lean();
    if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });

    const allStudents = await User.find({ role: "student" })
      .select("username email")
      .lean();
    const attempts = await PuzzleAttempt.find({
      puzzleId: req.params.id,
    }).lean();
    const attemptsMap = new Map(
      attempts.map((a) => [a.studentId.toString(), a])
    );

    const results = allStudents.map((student) => {
      const attempt = attemptsMap.get(student._id.toString());
      return {
        student: {
          _id: student._id,
          name: student.username,
          email: student.email,
        },
        taken: !!attempt,
        score: attempt?.score ?? null,
        submittedAt: attempt?.createdAt ?? null,
      };
    });
    res.json({ puzzle, results });
  } catch (err: any) {
    console.error("Error in getPuzzleResultsForAdmin:", err);
    res.status(500).json({ message: "Server error while fetching results." });
  }
};

// Fetch puzzle by id (hydrated for admin edit)

export const getPuzzleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const puzzle = await Puzzle.findById(req.params.id)
      .populate("componentPalette")
      .populate({
        path: "lockedComponents",
        populate: { path: "_id" },
      })
      .populate({
        path: "solution",
        populate: { path: "_id" },
      });

    if (!puzzle) {
      res.status(404).json({ message: "Puzzle not found" });
      return;
    }

    // console.log("📤 Puzzle fetched for edit (raw):", JSON.stringify(puzzle, null, 2));

    // Define index signatures so TypeScript knows you can assign by string keys
    const lockedComponents: { [slot: string]: IPart } = {};
    if (puzzle.lockedComponents) {
      for (const [slot, comp] of (
        puzzle.lockedComponents as unknown as Map<string, IPart>
      ).entries()) {
        lockedComponents[slot] = comp;
      }
    }

    const solution: { [slot: string]: IPart } = {};
    if (puzzle.solution) {
      for (const [slot, comp] of (
        puzzle.solution as unknown as Map<string, IPart>
      ).entries()) {
        solution[slot] = comp;
      }
    }

    const hydratedPuzzle = {
      _id: puzzle._id,
      title: puzzle.title,
      description: puzzle.description,
      visible: puzzle.visible,
      lockedComponents,
      slotsToFill: puzzle.slotsToFill,
      componentPalette: puzzle.componentPalette,
      solution,
      createdAt: puzzle.createdAt,
      updatedAt: puzzle.updatedAt,
    };

    // console.log(
    //   "📤 Puzzle fetched for edit (hydrated):",
    //   JSON.stringify(hydratedPuzzle, null, 2)
    // );
    res.json(hydratedPuzzle);
  } catch (error) {
    console.error("❌ Error fetching puzzle:", error);
    res.status(500).json({ message: "Error fetching puzzle", error });
  }
};

// Create puzzle
export const createPuzzle = async (req: Request, res: Response) => {
  try {
    // console.log("📥 Incoming puzzle create request body:", req.body);

    const data: any = { ...req.body };
    if (data.lockedComponents) {
      data.lockedComponents = new Map(Object.entries(data.lockedComponents));
    }
    if (data.solution) {
      data.solution = new Map(Object.entries(data.solution));
    }

    const puzzle = new Puzzle(data);
    await puzzle.save();

    // console.log("✅ Puzzle saved:", puzzle);
    res.status(201).json(puzzle);
  } catch (error: any) {
    console.error("❌ Error creating puzzle:", error.message);
    res.status(500).json({ message: "Error creating puzzle", error });
  }
};

// Update puzzle
export const updatePuzzle = async (req: Request, res: Response) => {
  try {
    // console.log("📥 Incoming puzzle update request body:", req.body);

    const updateData: any = { ...req.body };
    if (updateData.lockedComponents) {
      updateData.lockedComponents = new Map(
        Object.entries(updateData.lockedComponents)
      );
    }
    if (updateData.solution) {
      updateData.solution = new Map(Object.entries(updateData.solution));
    }

    const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!puzzle) {
      return res.status(404).json({ error: "Puzzle not found" });
    }

    const hydrated = await hydratePuzzleMaps(puzzle);
    // console.log(
    //   "✅ Puzzle updated (hydrated):",
    //   JSON.stringify(hydrated, null, 2)
    // );

    res.status(200).json(hydrated);
  } catch (error: any) {
    console.error("❌ Error updating puzzle:", error.message);
    res.status(500).json({ message: "Error updating puzzle", error });
  }
};

// Delete puzzle
export const deletePuzzle = async (req: Request, res: Response) => {
  try {
    const deleted = await Puzzle.findByIdAndDelete(req.params.id);
    await PuzzleAttempt.deleteMany({ puzzleId: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Puzzle not found" });
    res.json({ message: "Puzzle deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting puzzle:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
