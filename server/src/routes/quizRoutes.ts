// backend/src/routes/quizRoutes.ts

import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResultsForAdmin,
  getVisibleQuizzesForStudent,
} from "../controllers/quizController";

const router = Router();

// ==========================
// STUDENT-FACING ROUTES
// ==========================
router.get("/student", protect, getVisibleQuizzesForStudent);

// ==========================
// ADMIN QUIZ MANAGEMENT
// ==========================
router
  .route("/")
  .get(protect, adminOnly, getAllQuizzes)
  .post(protect, adminOnly, createQuiz);

router
  .route("/:id")
  .get(protect, getQuizById) // Allows both students and admins to get a quiz by ID
  .put(protect, adminOnly, updateQuiz)
  .delete(protect, adminOnly, deleteQuiz);

// ==========================
// QUIZ ATTEMPTS & RESULTS
// ==========================
router.post("/:quizId/submit", protect, submitQuiz);
router.get("/:quizId/results", protect, adminOnly, getQuizResultsForAdmin);

export default router;
