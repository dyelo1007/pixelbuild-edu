import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchQuizzes, deleteQuiz } from "../../../services/quizService";
import type { IQuiz } from "../../../types/quiz.types";

// ✨ 1. Import the necessary UI components
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

const QuizModeManagement = () => {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✨ 2. Add state to manage the delete confirmation dialog
  const [quizToDelete, setQuizToDelete] = useState<IQuiz | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await fetchQuizzes();
      if (Array.isArray(responseData)) {
        setQuizzes(responseData);
      } else {
        console.error("API did not return an array of quizzes:", responseData);
        setQuizzes([]);
      }
    } catch (err) {
      console.error("Failed to load quizzes:", err);
      setError("Could not fetch quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✨ 3. Update the delete handler to work with the dialog
  const handleDelete = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete._id);
      loadQuizzes(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    } finally {
      setQuizToDelete(null); // Close the dialog
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-900 dark:text-white">
        Loading quizzes...
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neonblue">
            Quiz Mode Management
          </h1>
          <Button
            asChild
            className="bg-neonblue text-black hover:bg-hoverprimary"
          >
            <Link to="/content/quiz-mode/add">Add New Quiz</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(quizzes) && quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-lightbg dark:bg-darkbg border border-neonblue/20 p-6 rounded-2xl shadow-md flex flex-col"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {quiz.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Questions: {quiz.questions.length}
                </p>
                <p className="text-sm font-medium mt-1">
                  {quiz.visible ? (
                    <span className="text-green-600 dark:text-green-400">
                      Visible to Students
                    </span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      Hidden from Students
                    </span>
                  )}
                </p>
                <div className="mt-auto pt-4 flex gap-2">
                  <Link
                    to={`/content/quiz-mode/edit/${quiz._id}`}
                    className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-lg transition-colors bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
                  >
                    Edit
                  </Link>
                  {/* ✨ 4. The delete button now opens the dialog */}
                  <button
                    onClick={() => setQuizToDelete(quiz)}
                    className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-lg transition-colors bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/quizzes/${quiz._id}/results`}
                    className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-lg transition-colors bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 col-span-full">
              No quizzes found. Add one to get started!
            </p>
          )}
        </div>
      </div>

      {/* ✨ 5. Add the AlertDialog component to the page */}
      <AlertDialog
        open={!!quizToDelete}
        onOpenChange={() => setQuizToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz "{quizToDelete?.title}" and all associated student results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuizModeManagement;
