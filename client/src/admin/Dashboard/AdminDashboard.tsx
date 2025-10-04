import API from "@/utils/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// icons
import { FaChartLine, FaUserAstronaut, FaUsersCog } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { MdOutlineLeaderboard } from "react-icons/md";

const pixieIcon = "/pixie.png";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStudentCount = async () => {
      setLoading(true); // It's good practice to set loading to true here
      try {
        const res = await API.get("/admin/count");
        setTotalStudents(res.data.count);
      } catch (error) {
        console.error("Error fetching student count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCount();
  }, []);

  const stats = [
    {
      label: "Total Students",
      value: loading ? "..." : totalStudents ?? 0,
      color: "bg-[#51ab91]",
    },
    { label: "Active Modes", value: 4, color: "bg-blue-500" },
    { label: "Quizzes Created", value: 35, color: "bg-purple-500" },
    { label: "Reports Pending", value: 7, color: "bg-red-500" },
  ];

  const adminPanels = [
    {
      title: "Student Management",
      desc: "View all students, track their progress, and manage accounts.",
      link: "/students",
      icon: <FaUsersCog size={24} />,
    },
    {
      title: "Learning Modes",
      desc: "Enable, disable, or customize modes available to students.",
      link: "/manage-modes",
      icon: <BsStack size={24} />,
    },
    {
      title: "Analytics & Reports",
      desc: "View performance analytics, activity logs, and leaderboard.",
      link: "/analytics",
      icon: <FaChartLine size={24} />,
    },
    {
      title: "Content Management",
      desc: "Add or edit quizzes, challenges, and simulations.",
      link: "/content-management",
      icon: <MdOutlineLeaderboard size={24} />,
    },

    {
      title: "Coming soon...",
      desc: "More admin tools will be added here.",
      link: "/coming-soon",
      icon: <FaUserAstronaut size={24} />,
    },
  ];

  return (
    <div className="min-h-screen rounded-2xl p-6 space-y-10 bg-lightbg text-gray-900 dark:bg-darkbg dark:text-white transition-colors">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-[120px] h-[120px]">
          <img src={pixieIcon} alt="Pixie Icon" className="w-full h-full" />
        </div>

        <div className="bg-lightbgfill dark:bg-darkbg border-4 border-[#51ab91] p-4 shadow-lg rounded-xl relative">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back, Admin!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Manage students, monitor performance, and customize learning.
          </p>
        </div>
      </header>

      {/* Quick Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-2xl shadow-md text-white ${stat.color}`}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Admin Panels */}
      <section>
        <div className="flex items-center gap-2 text-[#51ab91] font-semibold mb-4">
          <BsStack />
          <p>Admin Tools</p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {adminPanels.map((panel, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link to={panel.link}>
                <motion.div
                  className="bg-[#bde4d7] dark:bg-darkbg border border-[#51ab91] p-6 rounded-2xl shadow-md cursor-pointer flex flex-col h-56"
                  whileHover={{
                    y: -5,
                    boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-[12px] bg-[#51ab91]/20 text-[#51ab91] mb-3">
                    {panel.icon}
                  </div>

                  {/* Title + description */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{panel.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {panel.desc}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;
