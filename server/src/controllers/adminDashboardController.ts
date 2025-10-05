import { Request, Response } from "express";
import { User } from "../models/User";
import Quiz from "../models/Quiz";
import Challenge from "../models/Challenge";

// Fetches the main statistics for the admin dashboard cards
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [studentCount, quizCount, challengeCount] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Quiz.countDocuments(),
      Challenge.countDocuments(),
    ]);

    res.json({
      totalStudents: studentCount,
      totalQuizzes: quizCount,
      totalChallenges: challengeCount,
    });
  } catch (error: any) {
    console.error("Failed to fetch admin stats:", error);
    res.status(500).json({ message: "Server error while fetching stats." });
  }
};

// Fetches the 5 most recent activities for the admin dashboard feed
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const [recentStudents, recentQuizzes, recentChallenges] = await Promise.all(
      [
        User.find({ role: "student" })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("username createdAt"),
        Quiz.find().sort({ createdAt: -1 }).limit(5).select("title createdAt"),
        Challenge.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title createdAt"),
      ]
    );

    const studentActivities = recentStudents.map((item) => ({
      type: "New Student",
      title: item.username,
      date: item.createdAt,
      _id: `student-${item._id}`,
    }));
    const quizActivities = recentQuizzes.map((item) => ({
      type: "New Quiz",
      title: item.title,
      date: item.createdAt,
      _id: `quiz-${item._id}`,
    }));
    const challengeActivities = recentChallenges.map((item) => ({
      type: "New Challenge",
      title: item.title,
      date: item.createdAt,
      _id: `challenge-${item._id}`,
    }));

    const allActivities = [
      ...studentActivities,
      ...quizActivities,
      ...challengeActivities,
    ];
    allActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const recentActivities = allActivities.slice(0, 5);

    res.json(recentActivities);
  } catch (error: any) {
    console.error("Failed to fetch recent activity:", error);
    res.status(500).json({ message: "Server error while fetching activity." });
  }
};
