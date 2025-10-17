import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  fetchMyReviewSets,
  deleteReviewSet,
} from "@/services/reviewSetService";
import type { IReviewSet } from "@/types/review.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { FaPlus, FaWrench } from "react-icons/fa";

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

const ReviewModeDashboard = () => {
  const [sets, setSets] = useState<IReviewSet[]>([]);
  const [loading, setLoading] = useState(true);

  const [setToDelete, setSetToDelete] = useState<IReviewSet | null>(null);

  const loadSets = async () => {
    try {
      const data = await fetchMyReviewSets();
      setSets(data);
    } catch (err) {
      console.error("Failed to load review sets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  const handleDelete = async () => {
    if (!setToDelete) return;
    try {
      await deleteReviewSet(setToDelete._id);
      // Refresh the list to remove the deleted set
      loadSets();
    } catch (error) {
      console.error("Failed to delete review set:", error);
    } finally {
      // Close the dialog
      setSetToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading your review sets...
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-neonblue">
            My Review Sets
          </h1>
          <div className="flex gap-2">
            <Button
              asChild
              className="bg-neonblue text-black hover:bg-hoverprimary w-full sm:w-auto"
            >
              <Link to="/review-mode/new">
                <FaPlus className="mr-2 h-4 w-4" /> Create New Set
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/home">Back to Home</Link>
            </Button>
          </div>
        </div>

        {sets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sets.map((set) => (
              <Card
                key={set._id}
                className="bg-lightbg dark:bg-darkbg border border-neonblue/20 flex flex-col"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-900 dark:text-white">
                      {set.title}
                    </CardTitle>

                    {set.build && (
                      <FaWrench
                        className="h-4 w-4 text-gray-500"
                        title="Generated from a build"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-400">
                    {set.cards.length} card(s)
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2 justify-between items-center">
                  <div className="flex gap-2">
                    {set.build ? (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/build/${set.build}`}>View Build</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/review-mode/edit/${set._id}`}>Edit</Link>
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSetToDelete(set)}
                    >
                      Delete
                    </Button>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="bg-neonblue text-black hover:bg-hoverprimary"
                  >
                    <Link to={`/review-mode/practice/${set._id}`}>
                      Practice
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-lg bg-lightfill dark:bg-darkfill border-2 border-dashed border-neonblue/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              You haven't created any review sets yet.
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Click the button above to create your first flashcard set!
            </p>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!setToDelete}
        onOpenChange={() => setSetToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the review set titled "
              {setToDelete?.title}". This action cannot be undone.
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

export default ReviewModeDashboard;
