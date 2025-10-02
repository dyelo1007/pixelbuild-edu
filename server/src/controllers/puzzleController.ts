import { Request, Response } from "express";
import Puzzle from "../models/Puzzle";
import PuzzleAttempt from "../models/PuzzleAttempt";
import { User } from "../models/User";

// --- Student-Facing Functions ---
// GET /api/puzzles - Fetches all visible puzzles a student has not yet attempted
export const getVisiblePuzzles = async (req: Request, res: Response) => {
  try {
    const attemptedPuzzles = await PuzzleAttempt.find({
      studentId: req.user?._id,
    }).select("puzzleId");
    const attemptedPuzzleIds = attemptedPuzzles.map((a) => a.puzzleId);

    const puzzles = await Puzzle.find({
      visible: true,
      _id: { $nin: attemptedPuzzleIds }, // Exclude puzzles they've already attempted
    }).populate("lockedComponents componentPalette solution");

    res.json(puzzles);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /api/puzzles/submit - Submits a single puzzle attempt and calculates the score
export const submitPuzzleAttempt = async (req: Request, res: Response) => {
  try {
    const { puzzleId, build } = req.body;
    const studentId = req.user?._id;

    const puzzle = await Puzzle.findById(puzzleId).lean();
    if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });

    let score = 0;
    // The solution is a Map, convert it to a plain object for easy lookup
    const solutionObject = Object.fromEntries(puzzle.solution.entries());

    Object.entries(build).forEach(([slot, componentId]) => {
      if (
        solutionObject[slot] &&
        solutionObject[slot].toString() === componentId
      ) {
        score += 50; // Award points per correct part
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
      // Handles unique index violation (duplicate attempt)
      return res
        .status(400)
        .json({ message: "You have already attempted this puzzle." });
    }
    res.status(500).json({ message: "Server error while submitting attempt." });
  }
};

// --- Admin-Facing Functions ---

// GET /api/puzzles/admin/all - Fetches all puzzles for the admin view
export const getAllPuzzlesForAdmin = async (req: Request, res: Response) => {
  try {
    const puzzles = await Puzzle.find().sort({ createdAt: -1 });
    res.json(puzzles);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET /api/puzzles/:id/results - Gets results for a single puzzle
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
    res.status(500).json({ message: "Server error while fetching results." });
  }
};

// GET /api/puzzles/:id - Fetches a single puzzle for editing
export const getPuzzleById = async (req: Request, res: Response) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle not found." });
    }
    res.json(puzzle);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /api/puzzles - Creates a new puzzle
export const createPuzzle = async (req: Request, res: Response) => {
  try {
    const newPuzzle = new Puzzle(req.body);
    await newPuzzle.save();
    res.status(201).json(newPuzzle);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error creating puzzle", error: err.message });
  }
};

// PUT /api/puzzles/:id - Updates an existing puzzle
export const updatePuzzle = async (req: Request, res: Response) => {
  try {
    const updated = await Puzzle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Puzzle not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error updating puzzle", error: err.message });
  }
};

// DELETE /api/puzzles/:id - Deletes a puzzle
export const deletePuzzle = async (req: Request, res: Response) => {
  try {
    const deleted = await Puzzle.findByIdAndDelete(req.params.id);
    // Also delete any associated student attempts
    await PuzzleAttempt.deleteMany({ puzzleId: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Puzzle not found" });
    }
    res.json({ message: "Puzzle deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
