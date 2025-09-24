import { useLocation, useNavigate, Link } from "react-router-dom";
import type { IQuestion } from "@/types/quiz.types";

// ✨ 1. Import UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuizSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;
  const questions: IQuestion[] = location.state?.questions || [];

  const score = `${result?.attempt?.score || 0} / ${questions.length}`;
  const userAnswers = result?.attempt?.answers || [];

  // ✨ 2. Themed empty state
  if (!result) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center">
        <Card className="w-full max-w-md bg-lightbg dark:bg-darkbg border border-neonblue/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              No Summary Available
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              It looks like you arrived here without completing a quiz.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              asChild
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              <Link to="/quiz-mode">View Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    // ✨ 3. Themed and responsive main container
    <div className="p-4 sm:p-6">
      <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-neonblue">
            Quiz Summary
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 pt-2">
            Your final score is:{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {score}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, index) => (
            // ✨ 4. Themed block for each question
            <div
              key={index}
              className="rounded-lg p-4 bg-lightfill dark:bg-darkfill border border-neonblue/10"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Q{index + 1}: {q.question}
              </h3>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Your Answer:{" "}
                  <span
                    className={
                      userAnswers[index] === q.answer
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-red-600 dark:text-red-400 font-medium"
                    }
                  >
                    {userAnswers[index] || "Not Answered"}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Correct Answer:{" "}
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {q.answer}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          {/* ✨ 5. Themed action button */}
          <Button
            asChild
            className="bg-neonblue text-black hover:bg-hoverprimary"
          >
            <Link to="/home">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizSummary;
