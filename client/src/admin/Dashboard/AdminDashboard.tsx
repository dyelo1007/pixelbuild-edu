import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  fetchAdminStats,
  fetchRecentActivity,
  type IAdminActivity,
  type IAdminStats,
} from "@/services/adminDashboardService";

// icons
import { FaUsers, FaQuestionCircle, FaPuzzlePiece } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { MdOutlineAdminPanelSettings, MdHistory } from "react-icons/md";

const pixieIcon = "/pixie.png";

const AdminDashboard = () => {
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [activity, setActivity] = useState<IAdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch stats and activity in parallel for faster loading
        const [statsData, activityData] = await Promise.all([
          fetchAdminStats(),
          fetchRecentActivity(),
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Data for the main stat cards, now linked to the state
  const statCards = [
    {
      label: "Total Students",
      value: loading ? "..." : stats?.totalStudents ?? 0,
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      label: "Total Quizzes",
      value: loading ? "..." : stats?.totalQuizzes ?? 0,
      icon: <FaQuestionCircle className="w-6 h-6" />,
    },
    {
      label: "Total Challenges",
      value: loading ? "..." : stats?.totalChallenges ?? 0,
      icon: <FaPuzzlePiece className="w-6 h-6" />,
    },
  ];

  const adminPanels = [
    {
      title: "Student Management",
      desc: "View and manage all student accounts.",
      link: "/students",
      icon: <FaUsers size={24} />,
    },
    {
      title: "Quiz Management",
      desc: "Create, edit, and view results for quizzes.",
      link: "/content/quiz-mode",
      icon: <FaQuestionCircle size={24} />,
    },
    {
      title: "Challenge Hub",
      desc: "Manage puzzles, components, and challenges.",
      link: "/content/challenges",
      icon: <FaPuzzlePiece size={24} />,
    },
  ];

  const getActivityIcon = (type: IAdminActivity["type"]) => {
    switch (type) {
      case "New Student":
        return <FaUsers />;
      case "New Quiz":
        return <FaQuestionCircle />;
      case "New Challenge":
        return <FaPuzzlePiece />;
      default:
        return <BsStack />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-10 bg-lightbg text-gray-900 dark:bg-darkbg rounded-2xl dark:text-white transition-colors">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-[120px] h-[120px] hidden sm:block">
          <img src={pixieIcon} alt="Pixie Icon" className="w-full h-full" />
        </div>
        <div className="bg-lightfill dark:bg-darkfill border-2 border-neonblue p-4 shadow-lg rounded-lg">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back, Admin!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Here's a quick overview of your platform's activity.
          </p>
        </div>
      </header>

      {/* Quick Stats */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-2xl shadow-md bg-lightfill dark:bg-darkfill border"
              style={{
                borderColor: "rgba(81, 171, 145, 0.2)", // explicit initial color
              }}
              whileHover={{
                y: -5,
                borderColor: "#51ab91",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {stat.label}
                </h3>
                <div className="text-neonblue">{stat.icon}</div>
              </div>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Admin Panels */}
        <section>
          <div className="flex items-center gap-2 text-neonblue font-semibold mb-4">
            <MdOutlineAdminPanelSettings />
            <p>Admin Tools</p>
          </div>
          <div className="space-y-4">
            {adminPanels.map((panel) => (
              <Link key={panel.title} to={panel.link} className="group block">
                <motion.div
                  className="bg-lightbg dark:bg-darkbg border border-neonblue/20 p-4 rounded-xl shadow-md cursor-pointer group-hover:border-neonblue group-hover:-translate-y-1 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-neonblue/10 text-neonblue">
                      {panel.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {panel.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {panel.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center gap-2 text-neonblue font-semibold mb-4">
            <MdHistory />
            <p>Recent Activity</p>
          </div>
          <div className="bg-lightfill dark:bg-darkfill rounded-2xl p-4 space-y-3">
            {loading ? (
              <div className="text-center p-8 text-sm text-gray-500 dark:text-gray-400">
                Loading activity...
              </div>
            ) : activity.length > 0 ? (
              activity.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="bg-lightbg dark:bg-darkbg border border-neonblue/10 p-3 rounded-lg flex items-center gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-neonblue/20 text-neonblue">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center p-8 text-sm text-gray-500 dark:text-gray-400">
                No recent activity.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
