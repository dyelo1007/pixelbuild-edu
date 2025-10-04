import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getVisibleChallenges,
  getChallengeForStudent,
  submitChallengeAttempt,
  getAllChallengesForAdmin,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengeResults,
} from "../controllers/challengeController";

const router = Router();

// --- Student Routes ---
router.get("/", protect, getVisibleChallenges);
router.get("/:id", protect, getChallengeForStudent);
router.post("/submit", protect, submitChallengeAttempt);

// --- Admin Routes ---
router.get("/admin/all", protect, adminOnly, getAllChallengesForAdmin);
router.get("/:id/results", protect, adminOnly, getChallengeResults);
router.post("/", protect, adminOnly, createChallenge);
router.put("/:id", protect, adminOnly, updateChallenge);
router.delete("/:id", protect, adminOnly, deleteChallenge);

export default router;
