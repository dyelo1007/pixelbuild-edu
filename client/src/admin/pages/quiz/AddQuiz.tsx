import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createQuiz } from "../../../services/quizService";
import type { IQuestion } from "../../../types/quiz.types";

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

const AddQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<IQuestion[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [visible, setVisible] = useState(true);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };
  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuestions(updatedQuestions);
  };
  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === qIndex) {
        const updatedOptions = q.options.map((opt, j) =>
          j === oIndex ? value : opt
        );
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };
  const handleAnswerChange = (index: number, value: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, answer: value } : q
    );
    setQuestions(updatedQuestions);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQuiz({ title, questions, visible });
      navigate("/content/quiz-mode");
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neonblue">
              Add New Quiz
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title for the quiz"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="visible"
                checked={visible}
                onCheckedChange={(checked: boolean) => setVisible(checked)}
              />
              <Label
                htmlFor="visible"
                className="text-gray-800 dark:text-gray-200"
              >
                Visible to Students
              </Label>
            </div>

            {questions.map((q, idx) => (
              <div
                key={idx}
                className="space-y-4 rounded-lg border border-neonblue/20 p-4 bg-lightfill dark:bg-darkfill"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Question {idx + 1}
                  </h3>
                  {questions.length > 1 && (
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
              Save Quiz
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddQuiz;
