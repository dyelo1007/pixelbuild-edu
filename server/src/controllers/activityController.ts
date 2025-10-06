import { Request, Response } from "express";
import QuizAttempt from "../models/QuizAttempt";
import ChallengeAttempt from "../models/ChallengeAttempt";
import Quiz from "../models/Quiz";

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?._id;
    if (!studentId) {
      return res.status(401).json({ message: "User not found" });
    }

    // Fetch recent quiz attempts and populate the quiz details
    const quizAttempts = await QuizAttempt.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate<{ quizId: { title: string; questions: [] } }>(
        "quizId",
        "title questions"
      );

    // Fetch recent challenge attempts and populate the challenge title
    const challengeAttempts = await ChallengeAttempt.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("challengeId", "title");

    // Format quiz attempts into a standard activity format
    const formattedQuizActivities = quizAttempts.map((attempt) => ({
      type: "Quiz",
      title: attempt.quizId?.title || "Unknown Quiz",
      score: `${attempt.score} / ${attempt.quizId?.questions?.length || "N/A"}`,
      date: attempt.createdAt,
      _id: `quiz-${attempt._id}`,
    }));

    // Format challenge attempts into the same standard format
    const formattedChallengeActivities = challengeAttempts.map(
      (attempt: any) => ({
        type: "Challenge",
        title: attempt.challengeId?.title || "Unknown Challenge",
        score: `${attempt.totalScore}`, // Challenge score is a total number
        date: attempt.createdAt,
        _id: `challenge-${attempt._id}`,
      })
    );

    // Combine both lists
    const allActivities = [
      ...formattedQuizActivities,
      ...formattedChallengeActivities,
    ];

    // Sort the combined list by date, most recent first
    allActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Take the top 5 most recent activities from the combined list
    const recentActivities = allActivities.slice(0, 5);

    res.json(recentActivities);
  } catch (error: any) {
    console.error("Failed to fetch user activity:", error);
    res.status(500).json({ message: "Server error while fetching activity." });
  }
};
