import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllPuzzlesForAdmin,
  deletePuzzle,
} from "@/services/puzzleService";
import type { IPuzzle } from "@/types/puzzle.types";

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
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

const PuzzleManagement = () => {
  const [puzzles, setPuzzles] = useState<IPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [puzzleToDelete, setPuzzleToDelete] = useState<IPuzzle | null>(null);

  const loadPuzzles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllPuzzlesForAdmin();
      setPuzzles(data);
    } catch (err) {
      console.error("Failed to load puzzles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPuzzles();
  }, [loadPuzzles]);

  const handleDelete = async () => {
    if (!puzzleToDelete) return;
    try {
      await deletePuzzle(puzzleToDelete._id);
      loadPuzzles();
    } catch (err) {
      console.error("Failed to delete puzzle:", err);
    } finally {
      setPuzzleToDelete(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neonblue">
            Puzzle Management
          </h1>
          <Button variant="ghost" asChild>
            <Link to="/content/challenges">Back to Hub</Link>
          </Button>
        </div>
        <Card className="border border-neonblue shadow-lg bg-lightbg dark:bg-darkbg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              All Puzzles
            </CardTitle>
            <Button
              asChild
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              <Link to="/admin/puzzles/new">
                <FaPlus className="mr-2 h-4 w-4" /> Add Puzzle
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-gray-500"
                    >
                      Loading Puzzles...
                    </TableCell>
                  </TableRow>
                ) : puzzles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-gray-500"
                    >
                      No puzzles found. Click "Add Puzzle" to create your first
                      one.
                    </TableCell>
                  </TableRow>
                ) : (
                  puzzles.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-sm truncate">
                        {p.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.visible ? "default" : "secondary"}
                          className={
                            p.visible
                              ? "bg-green-500/20 text-green-400 border-none"
                              : "bg-yellow-500/20 text-yellow-400 border-none"
                          }
                        >
                          {p.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/puzzles/edit/${p._id}`}>
                            <FaEdit className="h-4 w-4 text-blue-500" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPuzzleToDelete(p)}
                        >
                          <FaTrash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!puzzleToDelete}
        onOpenChange={() => setPuzzleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{puzzleToDelete?.title}".
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
export default PuzzleManagement;
