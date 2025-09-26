import { useAuth } from "../../auth/context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaChartLine,
  FaWrench,
  FaBookOpen,
  FaPuzzlePiece,
  FaMicrochip,
  FaGamepad,
  FaQuestionCircle,
  FaUserAstronaut,
} from "react-icons/fa";
import { BsStack } from "react-icons/bs";

const pixieIcon = "/pixie.png";

const Dashboard = () => {
  const { user } = useAuth();

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
      desc: "Create and practice flashcard sets.",
      link: "/review-mode",
      icon: <FaBookOpen size={24} />,
    },
    {
      title: "Repair Mode",
      desc: "Diagnose and fix issues.",
      link: "/repair-mode",
      icon: <FaWrench size={24} />,
    },
    {
      title: "Simulation Mode",
      desc: "Analyze PC performance.",
      link: "/simulation-mode",
      icon: <FaGamepad size={24} />,
    },
  ];
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

      <motion.section
        className="bg-lightfill dark:bg-darkfill border border-neonblue/30 p-5 rounded-2xl shadow-md"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-3">
          <FaChartLine />
          <p>Your Learning Progress</p>
        </div>
        <ul className="space-y-6 text-gray-700 dark:text-gray-200">
          <li>
            <div className="flex justify-between items-center">
              <p>Overall Completion</p>
              <span className="text-sm text-neonblue font-semibold">30%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-darkgray rounded-full h-2">
              <div className="bg-neonblue h-2 rounded-full w-[30%]"></div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center">
              <p>Free Build Mastery</p>
              <span className="text-sm text-neonblue font-semibold">10%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-darkgray rounded-full h-2">
              <div className="bg-neonblue h-2 rounded-full w-[10%]"></div>
            </div>
          </li>
          <li>
            <div className="flex justify-between items-center">
              <p>Challenge Mode</p>
              <span className="text-sm text-neonblue font-semibold">5%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-darkgray rounded-full h-2">
              <div className="bg-neonblue h-2 rounded-full w-[5%]"></div>
            </div>
          </li>
        </ul>
      </motion.section>

      {/* Learning Modes */}
      <section>
        <div className="flex items-center gap-2 text-neonblue font-semibold mb-4">
          <BsStack />
          <p>Learning Modes</p>
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
