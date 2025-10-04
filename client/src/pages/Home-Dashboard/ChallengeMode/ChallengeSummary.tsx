import { useLocation, Link } from "react-router-dom";
import type { IChallenge } from "@/types/challenge.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ChallengeSummary = () => {
  const location = useLocation();
  const { scores, challenge } = (location.state || {}) as {
    scores: Record<string, number>;
    challenge: IChallenge;
  };

  // A fallback for if the user navigates here directly without completing a challenge
  if (!challenge || !scores) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          No Summary Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please complete a challenge to see your results.
        </p>
        <Button
          asChild
          className="mt-4 bg-neonblue text-black hover:bg-hoverprimary"
        >
          <Link to="/challenge-mode">Back to Challenges</Link>
        </Button>
      </div>
    );
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
        <CardHeader className="text-center items-center">
          <div className="text-4xl text-yellow-400 mb-4">🏆</div>
          <CardTitle className="text-3xl font-bold text-neonblue">
            Challenge Complete!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            {challenge.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Your final score is:
          </p>
          <p className="text-6xl font-bold text-gray-900 dark:text-white my-4">
            {totalScore}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            asChild
            className="bg-neonblue text-black hover:bg-hoverprimary"
          >
            <Link to="/challenge-mode">Back to Challenges</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChallengeSummary;
