import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchVisibleChallenges } from "@/services/challengeService";
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

const ChallengeMode = () => {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const data = await fetchVisibleChallenges();
        setChallenges(data);
      } catch (err) {
        console.error("Failed to load challenges:", err);
      } finally {
        setLoading(false);
      }
    };
    loadChallenges();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading Challenges...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-neonblue mb-6">
        Compatibility Challenges
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Card
              key={challenge._id}
              className="bg-lightbg dark:bg-darkbg border border-neonblue/20 flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  {challenge.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm h-10">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {challenge.puzzles.length} Puzzles
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-neonblue text-black hover:bg-hoverprimary"
                >
                  <Link to={`/challenge-mode/take/${challenge._id}`}>
                    Start Challenge
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No Challenges Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Check back later for new compatibility challenges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeMode;
