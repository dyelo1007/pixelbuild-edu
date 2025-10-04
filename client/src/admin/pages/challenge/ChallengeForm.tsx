import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchAllPuzzlesForAdmin } from "@/services/puzzleService";
import {
  createChallenge,
  updateChallenge,
  fetchChallengeById,
} from "@/services/challengeService";
import type { IPuzzle } from "@/types/puzzle.types";

import type { ChallengePayload } from "@/services/challengeService";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ChallengeForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [selectedPuzzles, setSelectedPuzzles] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Data State
  const [allPuzzles, setAllPuzzles] = useState<IPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const puzzlesData = await fetchAllPuzzlesForAdmin();
        setAllPuzzles(puzzlesData);

        if (isEditing && id) {
          const { challenge } = await fetchChallengeById(id);
          setTitle(challenge.title);
          setDescription(challenge.description);
          setVisible(challenge.visible);
          setSelectedPuzzles(challenge.puzzles.map((p) => p._id));
        }
      } catch (err) {
        console.error("Failed to load data for challenge form:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditing]);

  const handlePuzzleSelection = (puzzleId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPuzzles((prev) => [...prev, puzzleId]);
    } else {
      setSelectedPuzzles((prev) => prev.filter((id) => id !== puzzleId));
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim() || !description.trim()) {
      setFormError("Title and Description cannot be empty.");
      return false;
    }
    if (selectedPuzzles.length === 0) {
      setFormError(
        "You must select at least one puzzle to include in the challenge."
      );
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: ChallengePayload = {
      title,
      description,
      visible,
      puzzles: selectedPuzzles,
    };

    try {
      if (isEditing && id) {
        await updateChallenge(id, payload);
      } else {
        await createChallenge(payload);
      }
      navigate("/admin/challenges/list");
    } catch (err) {
      console.error("Failed to save challenge:", err);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading form...</div>;

  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neonblue">
              {isEditing ? "Edit Challenge" : "Create New Challenge"}
            </CardTitle>
            <CardDescription>
              Group puzzles together into a playable challenge for students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="challengeTitle">Challenge Title</Label>
              <Input
                id="challengeTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1: CPU & Motherboard Basics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="challengeDesc">Description</Label>
              <Textarea
                id="challengeDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief summary of what this challenge covers."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visible"
                checked={visible}
                onCheckedChange={(checked: boolean) => setVisible(checked)}
              />
              <Label htmlFor="visible">Visible to Students</Label>
            </div>
            <div>
              <Label>Select Puzzles to Include</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md mt-2 bg-lightfill dark:bg-darkfill">
                {allPuzzles.length > 0 ? (
                  allPuzzles.map((p) => (
                    <div key={p._id} className="flex items-center gap-2">
                      <Checkbox
                        id={`puzzle-${p._id}`}
                        checked={selectedPuzzles.includes(p._id)}
                        onCheckedChange={(checked) =>
                          handlePuzzleSelection(p._id, !!checked)
                        }
                      />
                      <Label htmlFor={`puzzle-${p._id}`}>{p.title}</Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No puzzles available. Please create some in Puzzle
                    Management first.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="ghost" asChild>
              <Link to="/admin/challenges/list">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              {isEditing ? "Save Changes" : "Create Challenge"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ChallengeForm;
