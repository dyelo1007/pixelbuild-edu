// src/pages/Home-Dashboard/QuizMode/QuizTake.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quizData } from "./QuizData";

const QuizTake = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const questions = quizData; // still using sample data for now
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );

  const handleSelect = (option: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] =
        prev[currentQuestion] === option ? null : option;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    navigate("/quiz-summary", { state: { answers, questions, moduleId } });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-6">
      {/** Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-neonblue font-semibold">
          Module {moduleId} Quiz
        </div>
        <div className="flex items-center gap-4 w-1/2">
          <div className="w-full bg-gray-700 h-2 rounded-lg overflow-hidden">
            <div
              className="h-full bg-neonblue transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-gray-400 text-sm">{Math.round(progress)}%</div>
        </div>
      </div>

      {/** Question area */}
      <div className="bg-darkgray p-6 rounded-2xl shadow-lg">
        <h2 className="text-neonblue font-bold mb-4">
          Question {currentQuestion + 1}: {questions[currentQuestion].question}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleSelect(option)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                answers[currentQuestion] === option
                  ? "bg-[#51ab91] border-[#30a838] text-black"
                  : "bg-darkgray border-gray-600 text-white hover:border-neonblue"
              }`}
            >
              {option}
            </div>
          ))}
        </div>

        {/** Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-darkgray border border-gray-600 rounded-lg text-white hover:bg-hoverprimary disabled:opacity-50"
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQuestion]} // ✅ disable until answered
              className="px-4 py-2 bg-neonblue text-black font-semibold rounded-lg hover:bg-hoverprimary disabled:opacity-50"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(prev + 1, questions.length - 1)
                )
              }
              disabled={!answers[currentQuestion]} // ✅ disable until answered
              className="px-4 py-2 bg-neonblue text-black font-semibold rounded-lg hover:bg-hoverprimary disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTake;
