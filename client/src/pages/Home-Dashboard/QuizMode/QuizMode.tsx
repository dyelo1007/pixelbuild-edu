// src/pages/Home-Dashboard/QuizMode/QuizMode.tsx
import { useNavigate } from "react-router-dom";

const QuizMode = () => {
  const navigate = useNavigate();

  const modules = [
    { id: 1, title: "Module 1 - CPU Basics", questions: 10 },
    { id: 2, title: "Module 2 - Memory", questions: 10 },
    { id: 3, title: "Module 3 - Storage", questions: 10 },
    { id: 4, title: "Module 4 - Graphics", questions: 10 },
    { id: 5, title: "Module 5 - Motherboard", questions: 10 },
    { id: 6, title: "Module 6 - Power Supply", questions: 10 },
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Quiz List</h1>

      <div className="grid grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => navigate(`/quiz/${mod.id}`)}
            className="bg-darkgray p-6 rounded-2xl shadow-lg border border-gray-700 cursor-pointer hover:border-neonblue transition"
          >
            <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
            <p>{mod.questions} Questions</p>
            <div className="w-full bg-gray-700 h-2 rounded-lg mt-3 overflow-hidden">
              <div
                className="h-full bg-neonblue"
                style={{ width: `34%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizMode;
