import { useAuth } from "../../auth/context/AuthContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

// icons
import { FaChartLine, FaUserAstronaut } from "react-icons/fa6";
import { BsStack } from "react-icons/bs";

const pixieIcon = "/pixie.png";

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const modes = [
    {
      title: "Free Build",
      desc: "Experiment freely with components and receive instant feedback on your builds.",
      link: "/build",
    },
    {
      title: "Challenge Mode",
      desc: "Compete in timed challenges to test your skills.",
      link: "/challenge-mode",
    },
    {
      title: "Quiz Mode",
      desc: "Test your knowledge with interactive quizzes and mini games.",
      link: "/quiz-mode",
    },
    {
      title: "Repair Mode",
      desc: "Diagnose  and fix issues in pre-built systems to learn troubleshooting.",
      link: "/repair-mode",
    },
    {
      title: "Simulation Mode",
      desc: "Analyze performance, power usage, and bottlenecks in your build.",
      link: "/simulation-mode",
    },
    {
      title: "Coming soon...",
      desc: "Coming soon.......",
      link: "/comming-soon",
    },
  ];

  return (
    //
    <div className="min-h-screen rounded-2xl p-6 space-y-8 bg-lightbg text-gray-900 dark:bg-darkbg dark:text-white transition-colors">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-[150px] h-[150px] -ml-[30px]">
          <img src={pixieIcon} alt="Pixie Icon" className="w-full h-full" />
        </div>

        <div className="bg-lightbgfill dark:bg-darkbg border-4 border-[#51ab91] p-4 shadow-lg rounded-none relative">
          <h1 className=" text-md md:text-xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {user?.name || "Boo Rat"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
            Continue your PC building journey
          </p>

          <div className="absolute left-[-12px] top-6 w-3 h-3 bg-lightbgfill dark:bg-darkbg border-l-4 border-b-4 border-[#51ab91]"></div>
        </div>
      </header>

      {/* Progress section */}
      <motion.section
        className="bg-[#bde4d7] dark:bg-darkbg border border-[#51ab91] p-5 rounded-2xl shadow-md"
        whileHover={{
          y: -5,
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center gap-2 text-[#51ab91] font-semibold mb-3">
          <FaChartLine />
          <p>Your Learning Progress</p>
        </div>
        <ul className="space-y-6 text-gray-700 dark:text-gray-200">
          {/* Overall Completion */}
          <li>
            <div className="flex justify-between items-center">
              <p>Overall Completion</p>
              <span className="text-sm text-[#51ab91] font-semibold">30%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-darkgray rounded-full h-2">
              <div className="bg-[#51ab91] h-2 rounded-full w-[30%]"></div>
            </div>
          </li>

          {/* Free Build Mastery */}
          <li>
            <div className="flex justify-between items-center">
              <p>Free Build Mastery</p>
              <span className="text-sm text-[#51ab91] font-semibold">10%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-darkgray rounded-full h-2">
              <div className="bg-[#51ab91] h-2 rounded-full w-[10%]"></div>
            </div>
          </li>

          {/* Challenge Mode */}
          <li>
            <div className="flex justify-between items-center">
              <p>Challenge Mode</p>
              <span className="text-sm text-[#51ab91] font-semibold">5%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-darkgray rounded-full h-2">
              <div className="bg-[#51ab91] h-2 rounded-full w-[5%]"></div>
            </div>
          </li>
        </ul>
      </motion.section>

      {/* Learning Modes */}
      <section>
        <div className="flex items-center gap-2 text-[#51ab91] font-semibold mb-4">
          <BsStack />
          <p>Learning Modes</p>
        </div>

        <div className="flex flex-wrap gap-6">
          {modes.map((mode, index) => (
            <Link key={index} to={mode.link}>
              <motion.div
                className="bg-[#bde4d7] dark:bg-darkbg border border-[#51ab91] p-6 rounded-2xl shadow-md cursor-pointer w-64 h-64 flex flex-col justify-between"
                whileHover={{
                  y: -5,
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-[12px] bg-[#51ab91]/20 text-[#51ab91] mb-3">
                  <FaUserAstronaut size={24} />
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{mode.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {mode.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm mt-2">
                  <p>0 completed</p>
                  <p>0%</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section>
        <div className="flex items-center gap-2 text-[#51ab91] font-semibold mb-4">
          <BsStack />
          <p>Badges</p>
        </div>

        <div className="flex flex-wrap gap-4 bg-[#bde4d7] dark:bg-darkgray rounded-2xl p-4">
          <motion.div
            className="bg-lightbg dark:bg-darkbg border border-[#51ab91] p-4 rounded-xl shadow-md flex flex-col items-center justify-center w-[120px] h-[120px] text-center"
            whileHover={{ y: -5, boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" }}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#51ab91]/20 text-[#51ab91] mb-2">
              <FaUserAstronaut size={20} />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              Component Master
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
