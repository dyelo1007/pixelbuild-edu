// src/pages/QuizResultsPage.tsx

import { useParams } from "react-router-dom";
import AdminQuizResults from "./AdminQuizResults";

const QuizResultsPage = () => {
  // The useParams hook reads the URL and finds the ':id' parameter
  const { id } = useParams<{ id: string }>();

  // If for some reason the ID isn't there, show a message
  if (!id) {
    return <div>Quiz ID not found in URL.</div>;
  }

  // Render your existing component and pass the ID as a prop
  return <AdminQuizResults quizId={id} />;
};

export default QuizResultsPage;
