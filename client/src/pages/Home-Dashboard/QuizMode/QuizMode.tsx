import { useState, useEffect } from "react";
import ModuleCard from "./ModuleCard";
import type { IQuiz } from "../../../types/quiz.types";
import { fetchStudentQuizzes } from "@/services/quizService";

const QuizMode = () => {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchStudentQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to load student quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading Quizzes...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-neonblue mb-6">
        Available Quizzes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map((q) => (
            <ModuleCard
              key={q._id}
              id={q._id}
              title={q.title}
              questions={q.questions.length}
              hasAttempted={!!q.hasAttempted}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No Quizzes Available
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Please check back later for new quizzes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
