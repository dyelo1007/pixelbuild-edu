import { Request, Response } from "express";
import Challenge from "../models/Challenge";
import ChallengeAttempt from "../models/ChallengeAttempt";
import { User } from "../models/User";

// --- Student-Facing Functions ---

// GET /api/challenges - Fetches all visible challenges for the student hub
export const getVisibleChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find({ visible: true }).select(
      "title description puzzles"
    );
    res.json(challenges);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET /api/challenges/:id - Fetches a single challenge for a student to play
export const getChallengeForStudent = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate({
      path: "puzzles",
      match: { visible: true },
      // This nested populate is crucial for fetching all component details
      populate: [
        { path: "componentPalette", model: "Component" },
        { path: "lockedComponents", model: "Component" },
        { path: "solution", model: "Component" },
      ],
    });

    if (!challenge || !challenge.visible) {
      return res.status(404).json({
        message: "Challenge not found or is not currently available.",
      });
    }

    // Filter out any puzzles that might have been nulled by the visibility match
    challenge.puzzles = challenge.puzzles.filter((p) => p !== null);

    // Convert to a plain object to ensure all data, especially Maps, is serialized correctly
    const challengeObject = challenge.toObject();

    const attempt = await ChallengeAttempt.findOne({
      challengeId: req.params.id,
      studentId: req.user?._id,
    });

    res.json({ challenge: challengeObject, attempt });
  } catch (err: any) {
    console.error("Error fetching challenge for student:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /api/challenges/submit - Submits a student's final attempt for a whole challenge
export const submitChallengeAttempt = async (req: Request, res: Response) => {
  try {
    const { challengeId, scores } = req.body;
    const studentId = req.user?._id;

    const totalScore = scores.reduce(
      (sum: number, s: { score: number }) => sum + s.score,
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
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- Admin-Facing Functions ---
export const getAllChallengesForAdmin = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find().populate("puzzles", "title");
    res.json(challenges);
  } catch (err: any) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const newChallenge = new Challenge(req.body);
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (err: any) {
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
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
