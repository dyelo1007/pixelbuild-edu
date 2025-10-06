
import { useCurrentUser } from "@/auth/context/currentUser";
import { useAuth } from "@/auth/context/AuthContext"; 
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchVisibleChallenges } from "@/services/challengeService";
import { fetchUserActivity, type IActivity } from "@/utils/activityService";
import type { IChallenge } from "@/types/challenge.types";

import {
  FaChartLine,
  FaWrench,
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

const Dashboard = () => {

  const { user: currentUser } = useCurrentUser();
  const { user: authUser } = useAuth();
  const user = currentUser ?? authUser;

  const [featuredChallenge, setFeaturedChallenge] = useState<IChallenge | null>(
    null
  );

  const [recentActivity, setRecentActivity] = useState<IActivity[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch both the next challenge and the recent activity in parallel
        const [availableChallenges, activityData] = await Promise.all([
          fetchVisibleChallenges(),
          fetchUserActivity(),
        ]);

        if (availableChallenges.length > 0) {
          setFeaturedChallenge(availableChallenges[0]);
        }

        setRecentActivity(activityData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    loadDashboardData();
  }, []);


  const modes = [
    {
      title: "Free Build",
      desc: "Experiment with components.",
      link: "/build",
      icon: <FaMicrochip size={24} />,
    },
    {
      title: "Challenge Mode",
      desc: "Solve compatibility puzzles.",
      link: "/challenge-mode",
      icon: <FaPuzzlePiece size={24} />,
    },
    {
      title: "Quiz Mode",
      desc: "Test your knowledge.",
      link: "/quiz-mode",
      icon: <FaQuestionCircle size={24} />,
    },
    {
      title: "Review Mode",
      desc: "Create & practice flashcard sets.",
      link: "/review-mode",
      icon: <FaBookOpen size={24} />,
    },
    {
      title: "Repair Mode",
      desc: "Diagnose and fix issues.",
      link: "/repair-mode",
      icon: <FaWrench size={24} />,
    },
  ];

  // Helper to get the correct icon based on activity type
  const getActivityIcon = (type: "Quiz" | "Challenge") => {
    if (type === "Quiz") return <FaQuestionCircle />;
    if (type === "Challenge") return <FaPuzzlePiece />;
    return <FaTrophy />;
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-lightbg text-gray-900 dark:bg-darkbg dark:text-white transition-colors">
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

      {/* "Your Next Challenge" section */}
      <section>
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-3">
          <FaChartLine />
          <p>Your Next Challenge</p>
        </div>
        <Card className="bg-lightfill dark:bg-darkfill border border-neonblue/30 shadow-md">
          {featuredChallenge ? (
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-grow">
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {featuredChallenge.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {featuredChallenge.description}
                </CardDescription>
              </div>
              <Button
                asChild
                className="w-full md:w-auto bg-neonblue text-black hover:bg-hoverprimary"
              >
                <Link to={`/challenge-mode/take/${featuredChallenge._id}`}>
                  Start Challenge
                </Link>
              </Button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                All Challenges Completed!
              </CardTitle>
              <CardDescription className="mt-1">
                Congratulations! You've mastered all available puzzles. Check
                back later for new content.
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
          {modes.map((mode) => (
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
          ))}
        </div>
      </section>

      {/* ✨ 4. "Recent Activity" section now renders live data */}
      <section>
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-4">
          <FaTrophy />
          <p>Recent Activity</p>
        </div>
        <div className="bg-lightfill dark:bg-darkfill rounded-2xl p-4 space-y-3">
          {recentActivity.length > 0 ? (
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
                You have no recent activity. Start a challenge or quiz to see
                your progress here!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
