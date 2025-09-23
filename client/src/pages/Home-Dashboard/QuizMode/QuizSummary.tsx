import { useLocation, useNavigate } from "react-router-dom";

const QuizSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // static placeholders (backend, kaya nyo na yan)
  const questions = location.state?.questions || [];
  const answers = location.state?.answers || [];

  // Static example score
  const score = "2 / 5";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-neonblue mb-6">Quiz Summary</h1>

      <div className="bg-darkgray p-6 rounded-2xl shadow-lg space-y-4">
        {questions.length > 0 ? (
          questions.map((q: any, index: number) => (
            <div key={index} className="p-4 border-b border-gray-600">
              <h2 className="font-semibold text-white">
                Q{index + 1}: {q.question}
              </h2>
              <p className="text-gray-400">
                Your Answer:{" "}
                <span className="text-neonblue">
                  {answers[index] || "Not Answered"}
                </span>
              </p>
              <p className="text-gray-400">
                Correct Answer:{" "}
                <span className="text-rightgreen">{q.answer}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No answers to display.</p>
        )}
      </div>

      <div className="mt-6 text-xl font-bold text-white">
        Score: <span className="text-neonblue">{score}</span>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-darkgray border border-gray-600 rounded-lg text-white hover:bg-hoverprimary"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate("/quiz-mode")}
          className="px-4 py-2 bg-neonblue text-black font-semibold rounded-lg hover:bg-hoverprimary"
        >
          Retry Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizSummary;
