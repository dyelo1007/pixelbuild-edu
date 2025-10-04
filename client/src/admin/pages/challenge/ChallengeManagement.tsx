import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllChallengesForAdmin,
  deleteChallenge,
} from "@/services/challengeService";
import type { IChallenge } from "@/types/challenge.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { FaPlus, FaEdit, FaTrash, FaChartBar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

const ChallengeManagement = () => {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [challengeToDelete, setChallengeToDelete] = useState<IChallenge | null>(
    null
  );

  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllChallengesForAdmin();
      setChallenges(data);
    } catch (err) {
      console.error("Failed to load challenges:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handleDelete = async () => {
    if (!challengeToDelete) return;
    try {
      await deleteChallenge(challengeToDelete._id);
      loadChallenges();
    } catch (err) {
      console.error("Failed to delete challenge:", err);
    } finally {
      setChallengeToDelete(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neonblue">
            Challenge Management
          </h1>
          <Button variant="ghost" asChild>
            <Link to="/content/challenges">Back to Hub</Link>
          </Button>
        </div>
        <Card className="border border-neonblue shadow-lg bg-lightbg dark:bg-darkbg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              All Challenges
            </CardTitle>
            <Button
              asChild
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              <Link to="/admin/challenges/new">
                <FaPlus className="mr-2 h-4 w-4" /> Add Challenge
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Puzzles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-gray-500"
                    >
                      Loading Challenges...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && challenges.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-gray-500"
                    >
                      No challenges found. Click "Add Challenge" to create one.
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  challenges.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell className="text-sm">
                        {c.puzzles.length}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.visible ? "default" : "secondary"}
                          className={
                            c.visible
                              ? "bg-green-500/20 text-green-400 border-none"
                              : "bg-yellow-500/20 text-yellow-400 border-none"
                          }
                        >
                          {c.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/challenges/${c._id}/results`}>
                            <FaChartBar className="h-4 w-4 text-green-500" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/challenges/edit/${c._id}`}>
                            <FaEdit className="h-4 w-4 text-blue-500" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setChallengeToDelete(c)}
                        >
                          <FaTrash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!challengeToDelete}
        onOpenChange={() => setChallengeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the challenge "
              {challengeToDelete?.title}" and all associated student attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default ChallengeManagement;
