// controllers/quizController.ts

import { Request, Response } from "express";
import Quiz from "../models/Quiz";
import QuizAttempt from "../models/QuizAttempt";
import { User } from "../models/User";

// ==========================
// QUIZ CRUD (For Admins)
// ==========================

// GET /api/quizzes/student (or any path you prefer)
export const getVisibleQuizzesForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    // Get the current user's ID from the JWT/session (set by your 'protect' middleware)
    const studentId = (req as any).user._id;

    // Find all visible quizzes (customize the select for performance if needed)
    const quizzes = await Quiz.find({ visible: true })
      .select("title questions visible")
      .lean();

    // Find all attempts by this user
    const attempts = await QuizAttempt.find({ studentId })
      .select("quizId")
      .lean();
    const attemptedQuizIds = new Set(attempts.map((a) => a.quizId.toString()));

    // Append the hasAttempted flag to each quiz
    const quizzesWithAttempt = quizzes.map((q) => ({
      ...q,
      id: q._id, // Ensure you have an id for the frontend
      questions: Array.isArray(q.questions) ? q.questions : [],
      hasAttempted: attemptedQuizIds.has(q._id.toString()),
    }));

    res.json(quizzesWithAttempt);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error fetching quizzes", error: err.message });
  }
};

// GET /api/quizzes
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error fetching quizzes", error: err.message });
  }
};

// GET /api/quizzes/:id
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error fetching quiz", error: err.message });
  }
};

// POST /api/quizzes
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error creating quiz", error: err.message });
  }
};

// PUT /api/quizzes/:id
export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedQuiz)
      return res.status(404).json({ message: "Quiz not found" });
    res.json(updatedQuiz);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error updating quiz", error: err.message });
  }
};

// DELETE /api/quizzes/:id
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz)
      return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error deleting quiz", error: err.message });
  }
};

// QUIZ ATTEMPTS (Student + Admin)

// POST /api/quizzes/:quizId/submit
export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;

    // Assuming your 'protect' middleware adds a 'user' object to the request.
    const studentId = (req as any).user._id;
    const { answers } = req.body;

    if (!studentId) {
      return res
        .status(401)
        .json({ message: "Not authorized. No user ID found." });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const existingAttempt = await QuizAttempt.findOne({ quizId, studentId });
    if (existingAttempt) {
      return res
        .status(400)
        .json({ message: "You have already submitted this quiz." });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score++;
      }
    });

    const attempt = new QuizAttempt({
      quizId,
      studentId,
      answers,
      score,
    });

    await attempt.save();
    res.status(201).json({ message: "Quiz submitted successfully", attempt });
  } catch (err: any) {
    console.error("Quiz submission error:", err.message);
    res.status(500).json({ message: "Server error while submitting quiz" });
  }
};

// GET /api/quizzes/:quizId/results (For Admins)
export const getQuizResultsForAdmin = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;

    // ✨ FIX: Fetch the quiz without removing the questions array.
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Get ALL students
    const allStudents = await User.find({ role: "student" })
      .select("username email")
      .lean();

    // Get all attempts for THIS quiz
    const attempts = await QuizAttempt.find({ quizId }).lean();

    // Create a map of attempts for easy lookup
    const attemptsMap = new Map(
      attempts.map((a) => [a.studentId.toString(), a])
    );

    // Combine the lists
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

    res.json({ quiz, results });
  } catch (err: any) {
    console.error("Error fetching admin results:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
