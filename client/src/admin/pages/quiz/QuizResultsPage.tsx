import { useParams } from "react-router-dom";
import AdminQuizResults from "./AdminQuizResults";

const QuizResultsPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Quiz ID not found in URL.</div>;
  }

  return <AdminQuizResults quizId={id} />;
};

export default QuizResultsPage;
