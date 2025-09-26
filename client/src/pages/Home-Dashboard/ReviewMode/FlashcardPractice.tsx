import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchReviewSetById } from "@/services/reviewSetService";
import type { IReviewSet } from "@/types/review.types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaUndo, FaCheck } from "react-icons/fa";

const FlashcardPractice = () => {
  const { id } = useParams<{ id: string }>();
  const [set, setSet] = useState<IReviewSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (id) {
      const loadSet = async () => {
        try {
          const data = await fetchReviewSetById(id);
          setSet(data);
        } catch (err) {
          console.error("Failed to fetch set:", err);
        }
      };
      loadSet();
    }
  }, [id]);

  const handleNext = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % (set?.cards.length || 1));
      }, 300);
    } else {
      setCurrentIndex((prev) => (prev + 1) % (set?.cards.length || 1));
    }
  };

  const handlePrev = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(
          (prev) =>
            (prev - 1 + (set?.cards.length || 1)) % (set?.cards.length || 1)
        );
      }, 300);
    } else {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + (set?.cards.length || 1)) % (set?.cards.length || 1)
      );
    }
  };

  const currentCard = set?.cards[currentIndex];

  if (!set)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading flashcards...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-neonblue">{set.title}</h1>
        <Button variant="ghost" asChild>
          <Link to={`/review-mode/practice/${id}`}>Back to Modes</Link>
        </Button>
      </div>

      {/* Container for  card */}
      <div className="flex-grow flex items-center justify-center">
        <div
          className="scene w-full h-64"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="card h-full w-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Front of the Card */}
            <div className="card-face card-front bg-lightbg dark:bg-darkbg border border-neonblue/30 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaUndo />
                <span>Question</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currentCard?.question}
              </p>
            </div>

            {/* Back of the Card */}
            <div className="card-face card-back bg-lightfill dark:bg-darkfill border border-neonblue/30 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCheck />
                <span>Answer</span>
              </div>
              <p className="text-xl text-gray-800 dark:text-gray-200">
                {currentCard?.answer}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <p className="text-center my-4 text-gray-600 dark:text-gray-400">
        Card {currentIndex + 1} of {set.cards.length}
      </p>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-neonblue text-black hover:bg-hoverprimary"
        >
          Next
        </Button>
      </div>

      <style>{`
        .scene { perspective: 1200px; }
        .card { position: relative; transform-style: preserve-3d; cursor: pointer; }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden; /* Safari */
        }
        .card-back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardPractice;
