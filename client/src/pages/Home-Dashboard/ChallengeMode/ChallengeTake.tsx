import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchChallengeById,
  submitChallengeAttempt,
} from "@/services/challengeService";
import type { IChallenge } from "@/types/challenge.types";
import type { IPuzzle } from "@/types/puzzle.types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggablePart from "./DraggablePart";
import DropSlot from "./DropSlot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProgressBar from "../QuizMode/ProgressBar";

const ChallengeTake = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzleScores, setPuzzleScores] = useState<Record<string, number>>({});

  const [currentBuild, setCurrentBuild] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<
    Record<string, "correct" | "incorrect">
  >({});
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const currentPuzzle = challenge?.puzzles[currentPuzzleIndex];

  useEffect(() => {
    if (challengeId) {
      const loadChallenge = async () => {
        const { challenge: data, attempt } = await fetchChallengeById(
          challengeId
        );
        if (attempt) {
          setHasAttempted(true);
        } else if (data && data.puzzles.length > 0) {
          setChallenge(data);
          resetForPuzzle(data.puzzles[0]);
        } else {
          setChallenge(data);
        }
      };
      loadChallenge();
    }
  }, [challengeId]);

  const resetForPuzzle = (puzzle: IPuzzle) => {
    const initialBuild = Object.fromEntries(
      Object.entries(puzzle.lockedComponents).map(([slot, comp]) => [
        slot,
        comp._id,
      ])
    );
    setCurrentBuild(initialBuild);
    setFeedback({});
    setIsChecked(false);
  };

  const handleDrop = (slotType: string, componentId: string) => {
    if (isChecked) return;
    setCurrentBuild((prev) => ({ ...prev, [slotType]: componentId }));
  };

  const checkCompatibility = () => {
    if (!currentPuzzle) return;
    const newFeedback: Record<string, "correct" | "incorrect"> = {};
    let correctCount = 0;

    currentPuzzle.slotsToFill.forEach((slotType) => {
      const userPartId = currentBuild[slotType];
      const correctPartId = Object.entries(currentPuzzle.solution).find(
        ([key]) => key === slotType
      )?.[1]._id;
      if (userPartId && userPartId === correctPartId) {
        newFeedback[slotType] = "correct";
        correctCount++;
      } else {
        newFeedback[slotType] = "incorrect";
      }
    });
    setFeedback(newFeedback);
    setPuzzleScores((prev) => ({
      ...prev,
      [currentPuzzle._id]: correctCount * 50,
    }));
    setIsChecked(true);
    setIsConfirming(false);
  };

  const handleNextPuzzle = () => {
    if (!challenge) return;
    const nextIndex = currentPuzzleIndex + 1;
    if (nextIndex < challenge.puzzles.length) {
      setCurrentPuzzleIndex(nextIndex);
      resetForPuzzle(challenge.puzzles[nextIndex]);
    } else {
      const finalScores = Object.entries(puzzleScores).map(
        ([puzzleId, score]) => ({ puzzleId, score })
      );
      submitChallengeAttempt({
        challengeId: challenge._id,
        scores: finalScores,
      });
      navigate(`/challenge-mode/summary/${challenge._id}`, {
        state: { scores: puzzleScores, challenge },
      });
    }
  };

  if (hasAttempted)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Challenge Already Attempted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You can only complete each challenge once.
        </p>
        <Button
          asChild
          className="mt-4 bg-neonblue text-black hover:bg-hoverprimary"
        >
          <Link to="/challenge-mode">Back to Challenges</Link>
        </Button>
      </div>
    );
  if (!challenge || !currentPuzzle)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading Challenge...
      </div>
    );

  const isPuzzleComplete = currentPuzzle.slotsToFill.every(
    (slot) => currentBuild[slot]
  );
  const challengeProgress = challenge
    ? ((currentPuzzleIndex + 1) / challenge.puzzles.length) * 100
    : 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neonblue text-center sm:text-left">
              {challenge.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>
                Puzzle: {currentPuzzleIndex + 1}/{challenge.puzzles.length}
              </span>
              <span>|</span>
              <span>
                Current Score:{" "}
                {Object.values(puzzleScores).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/challenge-mode">Exit Challenge</Link>
          </Button>
        </div>

        <div className="mb-6">
          <ProgressBar progress={challengeProgress} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-lightbg dark:bg-darkbg border border-neonblue/20">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  {currentPuzzle.title}
                </CardTitle>
                <CardDescription>{currentPuzzle.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentPuzzle.lockedComponents).map(
                  ([slot, comp]) => (
                    <DropSlot
                      key={slot}
                      type={slot}
                      feedback="locked"
                      lockedComponent={comp}
                      onDrop={() => {}}
                    />
                  )
                )}
                {currentPuzzle.slotsToFill.map((slotType) => (
                  <DropSlot
                    key={slotType}
                    type={slotType}
                    feedback={feedback[slotType]}
                    onDrop={handleDrop}
                    placedComponent={currentPuzzle.componentPalette.find(
                      (p) => p._id === currentBuild[slotType]
                    )}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-lightbg dark:bg-darkbg border border-neonblue/20 sticky top-6">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Available Parts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* ✨ FIX: Added a filter to prevent rendering invalid components */}
                {currentPuzzle.componentPalette
                  .filter((comp) => comp && comp.type)
                  .map((comp) => (
                    <DraggablePart key={comp._id} component={comp} />
                  ))}
                {!isChecked ? (
                  <Button
                    onClick={() => setIsConfirming(true)}
                    disabled={!isPuzzleComplete}
                    className="w-full bg-neonblue text-black hover:bg-hoverprimary mt-4"
                  >
                    Check Compatibility
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextPuzzle}
                    className="w-full bg-neonblue text-black hover:bg-hoverprimary mt-4"
                  >
                    {currentPuzzleIndex === challenge.puzzles.length - 1
                      ? "Finish & View Summary"
                      : "Next Puzzle"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Once you check, you can't change your components for this puzzle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={checkCompatibility}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              Check
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndProvider>
  );
};
export default ChallengeTake;
