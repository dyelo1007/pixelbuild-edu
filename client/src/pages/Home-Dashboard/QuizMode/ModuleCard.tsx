import React from "react";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  questions: number;
  hasAttempted: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  title,
  questions,
  hasAttempted,
}) => {
  return (
    <div className="group block">
      <div className="bg-lightbg dark:bg-darkbg h-full p-6 rounded-2xl shadow-md cursor-pointer border border-neonblue/20 group-hover:border-neonblue group-hover:-translate-y-1 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {questions} Questions
        </p>

        <div className="mt-4">
          {hasAttempted ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 rounded font-semibold cursor-not-allowed py-2 opacity-100"
            >
              Already Attempted
            </button>
          ) : (
            <Link
              to={`/quiz/${id}`}
              className="w-full inline-block text-neonblue font-semibold py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Start Quiz &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
