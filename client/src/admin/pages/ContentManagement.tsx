import { Link } from "react-router-dom";
import { FaQuestionCircle, FaPuzzlePiece, FaGamepad } from "react-icons/fa";

const modes = [
  {
    title: "Quiz Management",
    desc: "Create, edit, and view results for student quizzes.",
    icon: <FaQuestionCircle className="w-6 h-6" />,
    link: "/content/quiz-mode",
  },
  {
    title: "Challenge Management",
    desc: "Manage compatibility puzzles and the component library.",
    icon: <FaPuzzlePiece className="w-6 h-6" />,
    link: "/content/challenges",
  },
  {
    title: "Simulation Mode",
    desc: "Manage interactive hardware simulations.",
    icon: <FaGamepad className="w-6 h-6" />,
    link: "/content/simulation-mode",
  },
];

const ContentManagement = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-neonblue mb-6">
      Content Management
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {modes.map((mode, idx) => (
        <Link key={idx} to={mode.link} className="group">
          <div className="bg-lightbg dark:bg-darkbg p-6 rounded-2xl shadow-md flex flex-col h-56 cursor-pointer border border-neonblue/20 group-hover:border-neonblue transition-colors duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-neonblue/10 text-neonblue mb-3">
              {mode.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 flex-grow">
              {mode.desc}
            </p>
            <div className="text-neonblue font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 self-start">
              Manage &rarr;
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default ContentManagement;
