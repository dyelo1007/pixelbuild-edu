import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { fetchQuizById, submitQuiz } from "@/services/quizService";
import type { IQuiz } from "@/types/quiz.types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const QuizTake = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswerIndexes, setSelectedAnswerIndexes] = useState<
    (number | null)[]
  >([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ... (useEffect, handleSelect, and handleSubmit logic is unchanged)
  useEffect(() => {
    if (!moduleId) return;
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(moduleId);
        setQuiz(data);
        setSelectedAnswerIndexes(Array(data.questions.length).fill(null));
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      }
    };
    loadQuiz();
  }, [moduleId]);

  const handleSelect = (optionIndex: number) => {
    setSelectedAnswerIndexes((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = optionIndex;
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      const answersAsStrings = selectedAnswerIndexes.map(
        (selectedIndex, questionIndex) => {
          if (selectedIndex === null) return "";
          return quiz.questions[questionIndex].options[selectedIndex];
        }
      );
      const result = await submitQuiz(quiz._id, answersAsStrings);
      navigate("/quiz-summary", {
        state: { result, questions: quiz.questions },
      });
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || "An error occurred while submitting."
      );
    }
  };

  if (!quiz)
    return <p className="p-6 text-gray-900 dark:text-white">Loading Quiz...</p>;

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isCurrentQuestionAnswered =
    selectedAnswerIndexes[currentQuestion] !== null;

  return (
    <>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-neonblue text-center sm:text-left">
              {quiz.title}
            </h1>
            <Button variant="ghost" asChild>
              <Link to="/quiz-mode">Exit Quiz</Link>
            </Button>
          </div>
          {/* ✨ FIX: The layout for the progress bar and text is updated here */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar progress={progress} />
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium whitespace-nowrap">
              {currentQuestion + 1} / {quiz.questions.length}
            </div>
          </div>
        </div>

        <QuestionCard
          question={quiz.questions[currentQuestion].question}
          options={quiz.questions[currentQuestion].options}
          selectedAnswerIndex={selectedAnswerIndexes[currentQuestion]}
          onSelect={handleSelect}
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={() => setIsConfirming(true)}
              disabled={!isCurrentQuestionAnswered}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(prev + 1, quiz.questions.length - 1)
                )
              }
              disabled={!isCurrentQuestionAnswered}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* ... (AlertDialogs are unchanged) ... */}
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to submit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You can only take each quiz once. You will not be able to change
              your answers after submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!submitError}
        onOpenChange={() => setSubmitError(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submission Error</AlertDialogTitle>
            <AlertDialogDescription>{submitError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSubmitError(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default QuizTake;
