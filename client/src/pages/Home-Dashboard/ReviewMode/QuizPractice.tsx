import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchReviewSetById } from "@/services/reviewSetService";
import type { IReviewSet, IFlashcard } from "@/types/review.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { shuffle } from "lodash";

const QuizPractice = () => {
  const { id } = useParams<{ id: string }>();
  const [set, setSet] = useState<IReviewSet | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (id) {
      const loadSet = async () => {
        try {
          const data = await fetchReviewSetById(id);
          setSet(data);
          setAnswers(Array(data.cards.length).fill(null));
        } catch (err) {
          console.error(err);
        }
      };
      loadSet();
    }
  }, [id]);

  const quizQuestions = useMemo(() => {
    if (!set || set.cards.length < 2) return [];
    return set.cards.map((card) => {
      let options = [card.answer];
      let distractors = set.cards.filter((c) => c._id !== card._id);
      distractors = shuffle(distractors).slice(0, 3);
      options.push(...distractors.map((d) => d.answer));
      return {
        question: card.question,
        options: shuffle(options),
        correctAnswer: card.answer,
      };
    });
  }, [set]);

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[qIndex] = option;
      return newAnswers;
    });
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      if (answer === quizQuestions[index]?.correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  if (!set) return <div className="p-6 text-center">Loading quiz...</div>;
  if (set.cards.length < 2)
    return (
      <div className="p-6 text-center">
        You need at least 2 cards in this set to generate a quiz.
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neonblue">
            {set.title} - Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizQuestions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-lightfill dark:bg-darkfill p-4 rounded-lg border border-neonblue/10"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {qIndex + 1}. {q.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {q.options.map((option, oIndex) => {
                  let optionStyle =
                    "border-gray-300 dark:border-gray-700 hover:border-neonblue/50";
                  if (answers[qIndex] === option) {
                    optionStyle = "border-neonblue bg-neonblue/10";
                  }
                  if (isFinished) {
                    if (option === q.correctAnswer)
                      optionStyle = "border-green-500 bg-green-500/10";
                    else if (answers[qIndex] === option)
                      optionStyle = "border-red-500 bg-red-500/10";
                  }

                  return (
                    <Button
                      key={oIndex}
                      variant="outline"
                      className={`justify-start h-auto py-3 whitespace-normal ${optionStyle}`}
                      onClick={() =>
                        !isFinished && handleSelect(qIndex, option)
                      }
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {isFinished && (
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              Your Score: {calculateScore()} / {quizQuestions.length}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to={`/review-mode/practice/${id}`}>Back</Link>
            </Button>
            <Button
              onClick={() => setIsFinished(!isFinished)}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              {isFinished ? "Practice Again" : "Check Answers"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizPractice;
