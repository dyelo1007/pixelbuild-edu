// src/pages/Home-Dashboard/QuizMode/QuestionCard.tsx
import React from "react";

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedAnswerIndex: number | null;
  onSelect: (optionIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  selectedAnswerIndex,
  onSelect,
}) => (
  <div className="bg-lightbg dark:bg-darkbg p-4 sm:p-6 rounded-2xl shadow-md border border-neonblue/20">
    <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
      {question}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => onSelect(index)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 font-medium ${
            selectedAnswerIndex === index
              ? "border-neonblue bg-neonblue/10 text-gray-900 dark:text-white"
              : "border-gray-300 dark:border-gray-700 bg-lightfill dark:bg-darkfill text-gray-700 dark:text-gray-300 hover:border-neonblue/50"
          }`}
        >
          {option}
        </div>
      ))}
    </div>
  </div>
);
export default QuestionCard;
