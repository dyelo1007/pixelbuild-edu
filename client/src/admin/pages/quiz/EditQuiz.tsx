import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchQuizById, updateQuiz } from "../../../services/quizService";
import type { IQuiz } from "../../../types/quiz.types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const EditQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(id);
        setQuiz(data);
      } catch (error) {
        console.error("Failed to fetch quiz for editing:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [id]);

  const handleAddQuestion = () => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { question: "", options: ["", "", "", ""], answer: "" },
      ],
    });
  };
  const handleRemoveQuestion = (index: number) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };
  const handleInputChange = (field: keyof IQuiz, value: any) => {
    if (!quiz) return;
    setQuiz({ ...quiz, [field]: value });
  };
  const handleQuestionChange = (index: number, value: string) => {
    if (!quiz) return;
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };
  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    if (!quiz) return;
    const updatedQuestions = quiz.questions.map((q, i) => {
      if (i === qIndex) {
        const updatedOptions = q.options.map((opt, j) =>
          j === oIndex ? value : opt
        );
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };
  const handleAnswerChange = (index: number, value: string) => {
    if (!quiz) return;
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === index ? { ...q, answer: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !quiz) return;
    try {
      // Omit _id from the payload before sending
      const { _id, ...quizData } = quiz;
      await updateQuiz(id, quizData as any);
      navigate("/content/quiz-mode");
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-gray-900 dark:text-white">Loading quiz...</div>
    );
  if (!quiz)
    return (
      <div className="p-6 text-gray-900 dark:text-white">Quiz not found.</div>
    );

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neonblue">
              Edit Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="quizTitle"
                className="text-gray-800 dark:text-gray-200"
              >
                Quiz Title
              </Label>
              <Input
                id="quizTitle"
                type="text"
                value={quiz.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter the title for the quiz"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="visible"
                checked={quiz.visible}
                onCheckedChange={(checked) =>
                  handleInputChange("visible", checked)
                }
              />
              <Label
                htmlFor="visible"
                className="text-gray-800 dark:text-gray-200"
              >
                Visible to Students
              </Label>
            </div>

            {quiz.questions.map((q, idx) => (
              <div
                key={idx}
                className="space-y-4 rounded-lg border border-neonblue/20 p-4 bg-lightfill dark:bg-darkfill"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Question {idx + 1}
                  </h3>
                  {quiz.questions.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveQuestion(idx)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                  placeholder="Enter question"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt, i) => (
                    <Input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(idx, i, e.target.value)
                      }
                      placeholder={`Option ${i + 1}`}
                      required
                    />
                  ))}
                </div>
                <Input
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder="Correct answer (must match an option exactly)"
                  required
                />
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddQuestion}>
              Add Question
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" asChild>
              <Link to="/content/quiz-mode">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              Update Quiz
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EditQuiz;
