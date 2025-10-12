import { useCurrentUser } from "@/auth/context/currentUser";
import { useAuth } from "@/auth/context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchVisibleChallenges } from "@/services/challengeService";
import { fetchUserActivity, type IActivity } from "@/services/activityService";
import { fetchAvailableStudentQuizzes } from "@/services/quizService";
import {
  getPlatformSettings,
  type IPlatformSettings,
} from "@/services/platformSettingsService";
import type { IChallenge } from "@/types/challenge.types";
import type { IQuiz } from "@/types/quiz.types";

import {
  FaChartLine,
  FaBookOpen,
  FaPuzzlePiece,
  FaMicrochip,
  FaQuestionCircle,
  FaTrophy,
} from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pixieIcon = "/pixie.png";

const allModes = [
  {
    key: "isFreeBuildVisible",
    title: "Free Build",
    desc: "Experiment with components.",
    link: "/build",
    icon: <FaMicrochip size={24} />,
  },
  {
    key: "isChallengeModeVisible",
    title: "Challenge Mode",
    desc: "Solve compatibility puzzles.",
    link: "/challenge-mode",
    icon: <FaPuzzlePiece size={24} />,
  },
  {
    key: "isQuizModeVisible",
    title: "Quiz Mode",
    desc: "Test your knowledge.",
    link: "/quiz-mode",
    icon: <FaQuestionCircle size={24} />,
  },
  {
    key: "isReviewModeVisible",
    title: "Review Mode",
    desc: "Create & practice flashcard sets.",
    link: "/review-mode",
    icon: <FaBookOpen size={24} />,
  },
];

// DashboardItem union for type safety
type DashboardItem =
  | (IChallenge & { _itemType: "Challenge" })
  | (IQuiz & { _itemType: "Quiz" });

const Dashboard = () => {
  const { currentUser } = useCurrentUser();
  const { user: authUser } = useAuth();
  const user = currentUser ?? authUser;

  const [featuredItem, setFeaturedItem] = useState<DashboardItem | null>(null);
  const [recentActivity, setRecentActivity] = useState<IActivity[]>([]);
  const [visibleModes, setVisibleModes] = useState(allModes);
  const [settings, setSettings] = useState<IPlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function for challenge/quiz visibility
  const isItemVisible = (
    item: DashboardItem | null,
    settings: IPlatformSettings | null
  ): boolean => {
    if (!item || !settings) return false;
    if (item._itemType === "Challenge" && !settings.isChallengeModeVisible)
      return false;
    if (item._itemType === "Quiz" && !settings.isQuizModeVisible) return false;
    return true;
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [
          availableChallenges,
          availableQuizzes,
          activityData,
          platformSettings,
        ] = await Promise.all([
          fetchVisibleChallenges(),
          fetchAvailableStudentQuizzes(),
          fetchUserActivity(),
          getPlatformSettings(),
        ]);

        setSettings(platformSettings);
        setRecentActivity(activityData);

        // --- Debug logs ---
        console.log("Raw Quizzes API result:", availableQuizzes);
        console.log("isQuizModeVisible:", platformSettings?.isQuizModeVisible);

        // Filter quizzes: visible and not yet attempted
        const unattemptedQuizzes = availableQuizzes.filter(
          (q) => q.visible && !q.hasAttempted
        );
        console.log("Filtered unattempted quizzes:", unattemptedQuizzes);

        // For challenges (adds visible filter only, update if you track attempts)
        const unattemptedChallenges = availableChallenges.filter(
          (c) => c.visible
        );
        console.log("Available (visible) challenges:", unattemptedChallenges);

        // --- Main dashboard item selection ---
        const allDashboardItems: DashboardItem[] = [
          ...unattemptedChallenges.map((c) => ({
            ...c,
            _itemType: "Challenge" as const,
          })),
          ...unattemptedQuizzes.map((q) => ({
            ...q,
            _itemType: "Quiz" as const,
          })),
        ];

        console.log("All dashboard next activity options:", allDashboardItems);

        const nextItem =
          allDashboardItems.length > 0 ? allDashboardItems[0] : null;
        setFeaturedItem(nextItem);

        // Visible modes filtering
        const filteredModes = platformSettings
          ? allModes.filter(
              (mode) => platformSettings[mode.key as keyof IPlatformSettings]
            )
          : allModes;
        setVisibleModes(filteredModes);

        // More logging!
        console.log("Filtered visible modes:", filteredModes);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setVisibleModes(allModes);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getActivityIcon = (type: "Quiz" | "Challenge") => {
    if (type === "Quiz") return <FaQuestionCircle />;
    if (type === "Challenge") return <FaPuzzlePiece />;
    return <FaTrophy />;
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-lightbg text-gray-900 dark:bg-darkbg dark:text-white transition-colors rounded-2xl">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-[150px] h-[150px] -ml-[30px] hidden sm:block">
          <img src={pixieIcon} alt="Pixie Icon" className="w-full h-full" />
        </div>
        <div className="bg-lightfill dark:bg-darkfill border-2 border-neonblue p-4 shadow-lg rounded-lg relative">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {user?.username || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
            Continue your PC building journey.
          </p>
        </div>
      </header>

      {/* "Your Next Challenge/Quiz" section */}
      <section>
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-3">
          <FaChartLine />
          <p>Your Next Challenge</p>
        </div>
        <Card className="bg-lightfill dark:bg-darkfill border border-neonblue/30 shadow-md">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : featuredItem && isItemVisible(featuredItem, settings) ? (
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-grow">
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {featuredItem.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {featuredItem._itemType === "Challenge"
                    ? featuredItem.description
                    : "Take this quiz to test your knowledge!"}
                </CardDescription>
              </div>
              <Button
                asChild
                className="w-full md:w-auto bg-neonblue text-black hover:bg-hoverprimary"
              >
                {featuredItem._itemType === "Challenge" ? (
                  <Link to={`/challenge-mode/take/${featuredItem._id}`}>
                    Start Challenge
                  </Link>
                ) : (
                  <Link to={`/quiz-mode/take/${featuredItem._id}`}>
                    Start Quiz
                  </Link>
                )}
              </Button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                No Challenge or Quiz Available
              </CardTitle>
              <CardDescription className="mt-1">
                Nothing is currently available based on mode visibility. Please
                check back later!
              </CardDescription>
            </div>
          )}
        </Card>
      </section>

      {/* Learning Modes */}
      <section>
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-4">
          <BsStack />
          <p>All Learning Modes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading && visibleModes.length > 0 ? (
            visibleModes.map((mode) => (
              <Link key={mode.title} to={mode.link} className="group">
                <motion.div
                  className="bg-lightbg dark:bg-darkbg border border-neonblue/20 p-6 rounded-2xl shadow-md cursor-pointer h-full flex flex-col justify-between group-hover:border-neonblue group-hover:-translate-y-1 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div>
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-neonblue/10 text-neonblue mb-3">
                      {mode.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {mode.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {mode.desc}
                    </p>
                  </div>
                  <div className="text-neonblue font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                    Open &rarr;
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-lightfill dark:bg-darkfill rounded-xl border-2 border-dashed border-neonblue/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No Learning Modes Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                The admin is currently updating content. Please check back
                later!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity section */}
      <section>
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-4">
          <FaTrophy />
          <p>Recent Activity</p>
        </div>
        <div className="bg-lightfill dark:bg-darkfill rounded-2xl p-4 space-y-3">
          {loading ? (
            <div className="text-center p-8 text-sm text-gray-500">
              Loading activity...
            </div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <motion.div
                key={activity._id}
                className="bg-lightbg dark:bg-darkbg border border-neonblue/20 p-4 rounded-lg flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-neonblue/20 text-neonblue">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-neonblue">
                    {activity.score}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-600 dark:text-gray-400">
                You have no recent activity.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
