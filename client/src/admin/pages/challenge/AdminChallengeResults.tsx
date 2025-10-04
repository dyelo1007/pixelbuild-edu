import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchChallengeResults } from "@/services/challengeService";
// import type { IChallenge } from "@/types/challenge.types";
import type { IQuizResult } from "@/types/quiz.types"; // Reusing this for the student result structure

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AdminChallengeResults = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<IQuizResult[]>([]);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchChallengeResults(id);
        const sortedResults = res.results.sort(
          (a: IQuizResult, b: IQuizResult): number =>
            a.student.name.localeCompare(b.student.name)
        );
        setResults(sortedResults);
        setChallengeTitle(res.challenge.title);
      } catch (err) {
        console.error("Error fetching challenge results:", err);
        setError("Failed to load challenge results.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading results...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <Card className="border border-neonblue shadow-lg bg-lightbg dark:bg-darkbg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Student Results For
            </p>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {challengeTitle}
            </CardTitle>
          </div>
          <Button
            asChild
            className="bg-neonblue text-black hover:bg-hoverprimary w-full sm:w-auto"
          >
            <Link to="/admin/challenges/list">Back to Challenges</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="border-b-neonblue/20 bg-lightfill dark:bg-darkfill">
                  <TableHead className="text-gray-800 dark:text-gray-200">
                    Student
                  </TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-200">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-200">
                    Status
                  </TableHead>
                  <TableHead className="text-center text-gray-800 dark:text-gray-200">
                    Total Score
                  </TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-200">
                    Date Submitted
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results && results.length > 0 ? (
                  results.map((r) => (
                    <TableRow
                      key={r.student._id}
                      className="border-b-neonblue/10 hover:bg-lightfill dark:hover:bg-darkfill"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {r.student.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {r.student.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            r.taken
                              ? "bg-green-500/20 text-green-400 border-none"
                              : "bg-yellow-500/20 text-yellow-400 border-none"
                          }
                        >
                          {r.taken ? "Completed" : "Not Taken"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-gray-900 dark:text-white">
                        {r.score ?? "—"}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {r.submittedAt
                          ? new Date(r.submittedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      No attempts have been submitted for this challenge yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminChallengeResults;
