import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createReviewSet,
  updateReviewSet,
  fetchReviewSetById,
} from "@/services/reviewSetService";
import type { ReviewSetPayload } from "@/services/reviewSetService";
import type { IFlashcard } from "@/types/review.types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaTrash, FaPlus } from "react-icons/fa";

const ReviewSetForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<Partial<IFlashcard>[]>([
    { question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const loadSet = async () => {
        try {
          const data = await fetchReviewSetById(id);
          setTitle(data.title);
          setCards(data.cards);
        } catch (err) {
          console.error("Failed to fetch set for editing:", err);
          setError("Could not load this review set.");
        } finally {
          setLoading(false);
        }
      };
      loadSet();
    }
  }, [id, isEditing]);

  const handleCardChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { question: "", answer: "" }]);
  };

  const removeCard = (index: number) => {
    if (cards.length <= 1) return;
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ReviewSetPayload = { title, cards: cards as IFlashcard[] };
    try {
      if (isEditing && id) {
        await updateReviewSet(id, payload);
      } else {
        await createReviewSet(payload);
      }
      navigate("/review-mode");
    } catch (err) {
      console.error("Failed to save review set:", err);
      setError("An error occurred while saving. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading editor...
      </div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neonblue">
              {isEditing ? "Edit Review Set" : "Create New Review Set"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isEditing
                ? "Update the title and cards for your set."
                : "Add a title and at least one flashcard to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="setTitle"
                className="text-gray-800 dark:text-gray-200"
              >
                Set Title
              </Label>
              <Input
                id="setTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1 Vocabulary"
                required
              />
            </div>

            {cards.map((card, index) => (
              <div
                key={index}
                className="rounded-lg border border-neonblue/20 p-4 bg-lightfill dark:bg-darkfill space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Card {index + 1}
                  </h3>
                  {cards.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCard(index)}
                    >
                      <FaTrash className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`card-question-${index}`}
                      className="text-sm text-gray-800 dark:text-gray-200"
                    >
                      Question / Term
                    </Label>
                    <Textarea
                      id={`card-question-${index}`}
                      value={card.question}
                      onChange={(e) =>
                        handleCardChange(index, "question", e.target.value)
                      }
                      placeholder="Front of the card"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`card-answer-${index}`}
                      className="text-sm text-gray-800 dark:text-gray-200"
                    >
                      Answer / Definition
                    </Label>
                    <Textarea
                      id={`card-answer-${index}`}
                      value={card.answer}
                      onChange={(e) =>
                        handleCardChange(index, "answer", e.target.value)
                      }
                      placeholder="Back of the card"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addCard}>
              <FaPlus className="mr-2 h-4 w-4" /> Add Another Card
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" asChild>
              <Link to="/review-mode">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              {isEditing ? "Save Changes" : "Create Set"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ReviewSetForm;
