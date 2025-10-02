import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getVisiblePuzzles,
  submitPuzzleAttempt,
  getAllPuzzlesForAdmin,
  getPuzzleById,
  createPuzzle,
  updatePuzzle,
  deletePuzzle,
  getPuzzleResultsForAdmin,
} from "../controllers/puzzleController";

const router = Router();

// --- Student Routes ---
router.get("/", protect, getVisiblePuzzles);
router.post("/submit", protect, submitPuzzleAttempt);

// --- Admin Routes ---
router.get("/admin/all", protect, adminOnly, getAllPuzzlesForAdmin);
router.get("/:id/results", protect, adminOnly, getPuzzleResultsForAdmin);

router
  .route("/:id")
  .get(protect, adminOnly, getPuzzleById) // For editing
  .put(protect, adminOnly, updatePuzzle)
  .delete(protect, adminOnly, deletePuzzle);

// This needs to be separate to avoid conflict with /:id
router.post("/", protect, adminOnly, createPuzzle);

export default router;
