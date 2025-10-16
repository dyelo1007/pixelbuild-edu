import { Request, Response } from "express";
import Challenge from "../models/Challenge";
import ChallengeAttempt from "../models/ChallengeAttempt";
import { User } from "../models/User";
import Component from "../models/Component";

/**
 * Helper: Given a puzzle (Mongoose doc or plain object), return a plain object
 * where lockedComponents and solution map slot -> full component doc (or null).
 */
async function hydratePuzzleMaps(puzzleDoc: any) {
  const puzzle = puzzleDoc.toObject ? puzzleDoc.toObject() : { ...puzzleDoc };
  const locked = puzzle.lockedComponents
    ? puzzle.lockedComponents instanceof Map
      ? Object.fromEntries(puzzle.lockedComponents.entries())
      : { ...puzzle.lockedComponents }
    : {};
  const lockedIds = Object.values(locked)
    .filter(Boolean)
    .map((id: any) => id.toString());
  const solutionMap = puzzle.solution
    ? puzzle.solution instanceof Map
      ? Object.fromEntries(puzzle.solution.entries())
      : { ...puzzle.solution }
    : {};
  const solutionIds = Object.values(solutionMap)
    .filter(Boolean)
    .map((id: any) => id.toString());
  const allIds = Array.from(new Set([...lockedIds, ...solutionIds]));
  const components = allIds.length
    ? await Component.find({ _id: { $in: allIds } }).lean()
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
    const paletteDocs = await Component.find({ _id: { $in: palette } }).lean();
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

/**
 * GET /api/challenges
 * Student view: minimal list of visible challenges
 */
export const getVisibleChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find({ visible: true })
      .select("title description puzzles visible")
      .lean();
    res.json(challenges);
  } catch (err: any) {
    console.error("Error getting visible challenges:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * GET /api/challenges/:id
 * Fetch a single challenge for a student to play. Returns { challenge, attempt }.
 * This hydrates puzzle.lockedComponents (slot -> component doc) and solution likewise.
 */
export const getChallengeForStudent = async (req: Request, res: Response) => {
  try {
    const challengeDoc = await Challenge.findById(req.params.id).populate({
      path: "puzzles",
      populate: [
        { path: "componentPalette", model: "Component" },
        // ❌ Remove lockedComponents and solution here — hydratePuzzleMaps handles them
      ],
    });

    // console.log(
    //   "🧠 Populated challenge (before hydration):",
    //   JSON.stringify(challengeDoc, null, 2)
    // );

    if (!challengeDoc || !challengeDoc.visible) {
      return res.status(404).json({
        message: "Challenge not found or is not currently available.",
      });
    }

    // Filter out null puzzles and hydrate each puzzle
    const rawPuzzles = (challengeDoc.puzzles || []).filter(
      (p: any) => p != null
    );
    const hydratedPuzzles = await Promise.all(
      rawPuzzles.map((p: any) => hydratePuzzleMaps(p))
    );

    // Build a plain challenge object to send to client (with hydrated puzzles)
    const challengeObject = {
      ...challengeDoc.toObject(),
      puzzles: hydratedPuzzles,
    };

    // If the student already has an attempt, return it
    const attempt = await ChallengeAttempt.findOne({
      challengeId: req.params.id,
      studentId: req.user?._id,
    }).lean();

    res.json({ challenge: challengeObject, attempt });
  } catch (err: any) {
    console.error("Error fetching challenge for student:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * POST /api/challenges/submit
 * Submits a student's final attempt for a whole challenge
 */
export const submitChallengeAttempt = async (req: Request, res: Response) => {
  try {
    const { challengeId, scores } = req.body;
    const studentId = req.user?._id;

    const totalScore = (scores || []).reduce(
      (sum: number, s: { score: number }) => sum + (s.score || 0),
      0
    );

    const attempt = new ChallengeAttempt({
      challengeId,
      studentId,
      scores,
      totalScore,
      completed: true,
    });
    await attempt.save();
    res
      .status(201)
      .json({ message: "Challenge submitted successfully!", attempt });
  } catch (err: any) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already submitted this challenge." });
    }
    console.error("Error submitting challenge attempt:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/* -------- Admin functions (unchanged behavior but kept here) -------- */

export const getAllChallengesForAdmin = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find()
      .populate("puzzles", "title")
      .lean();
    res.json(challenges);
  } catch (err: any) {
    console.error("Error in getAllChallengesForAdmin:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const newChallenge = new Challenge(req.body);
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (err: any) {
    console.error("Error creating challenge:", err);
    res
      .status(400)
      .json({ message: "Error creating challenge", error: err.message });
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Challenge not found" });
    res.json(updated);
  } catch (err: any) {
    console.error("Error updating challenge:", err);
    res
      .status(400)
      .json({ message: "Error updating challenge", error: err.message });
  }
};

export const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const deleted = await Challenge.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Challenge not found" });
    await ChallengeAttempt.deleteMany({ challengeId: req.params.id });
    res.json({ message: "Challenge and all associated attempts deleted" });
  } catch (err: any) {
    console.error("Error deleting challenge:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getChallengeResults = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findById(req.params.id).lean();
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    const allStudents = await User.find({ role: "student" })
      .select("username email")
      .lean();
    const attempts = await ChallengeAttempt.find({
      challengeId: req.params.id,
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
        score: attempt?.totalScore ?? null,
        submittedAt: attempt?.createdAt ?? null,
      };
    });

    res.json({ challenge, results });
  } catch (err: any) {
    console.error("Error in getChallengeResults:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
