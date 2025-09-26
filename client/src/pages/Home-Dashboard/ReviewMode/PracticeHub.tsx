import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchReviewSetById } from "@/services/reviewSetService";
import type { IReviewSet } from "@/types/review.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaLayerGroup, FaFileAlt } from "react-icons/fa";

const PracticeHub = () => {
  const { id } = useParams<{ id: string }>();
  const [set, setSet] = useState<IReviewSet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadSet = async () => {
        try {
          const data = await fetchReviewSetById(id);
          setSet(data);
        } catch (err) {
          console.error("Failed to fetch set:", err);
        } finally {
          setLoading(false);
        }
      };
      loadSet();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading practice session...
      </div>
    );
  }

  if (!set) {
    return (
      <div className="p-6 text-center text-red-500">
        Could not find this review set.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-neonblue">
              {set.title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {set.cards.length} card(s) ready for review. Choose your practice
              mode below.
            </CardDescription>
          </div>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/review-mode">Back to My Sets</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to={`/review-mode/practice/flashcards/${id}`} className="group">
            <div className="bg-lightfill dark:bg-darkfill p-6 rounded-lg border border-neonblue/20 group-hover:border-neonblue transition-colors h-full">
              <FaLayerGroup className="h-8 w-8 text-neonblue mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Flashcards
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review terms and definitions one by one.
              </p>
            </div>
          </Link>
          <Link to={`/review-mode/practice/quiz/${id}`} className="group">
            <div className="bg-lightfill dark:bg-darkfill p-6 rounded-lg border border-neonblue/20 group-hover:border-neonblue transition-colors h-full">
              <FaFileAlt className="h-8 w-8 text-neonblue mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Quiz
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test your knowledge with multiple-choice questions.
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeHub;
