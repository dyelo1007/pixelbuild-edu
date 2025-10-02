import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchAllComponents } from "@/services/componentService";
import {
  createPuzzle,
  updatePuzzle,
  fetchPuzzleById,
} from "@/services/puzzleService";
import type { IComponent } from "@/types/component.types";
import type { PuzzlePayload } from "@/types/puzzle.types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaPlus, FaTrash } from "react-icons/fa";
import { groupBy } from "lodash";

const PuzzleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [allComponents, setAllComponents] = useState<IComponent[]>([]);
  const [groupedComponents, setGroupedComponents] = useState<
    Record<string, IComponent[]>
  >({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState<[string, string][]>([["", ""]]);
  const [palette, setPalette] = useState<string[]>([]);
  const [solution, setSolution] = useState<[string, string][]>([["", ""]]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const components = await fetchAllComponents();
        setAllComponents(components);
        setGroupedComponents(groupBy(components, "type"));

        if (isEditing && id) {
          const puzzle = await fetchPuzzleById(id);
          setTitle(puzzle.title);
          setDescription(puzzle.description);
          setVisible(puzzle.visible);
          setLocked(
            Object.keys(puzzle.lockedComponents).length > 0
              ? Object.entries(puzzle.lockedComponents).map(([key, comp]) => [
                  key,
                  comp._id,
                ])
              : [["", ""]]
          );
          setPalette(puzzle.componentPalette.map((c) => c._id));
          setSolution(
            Object.entries(puzzle.solution).map(([key, comp]) => [
              key,
              comp._id,
            ])
          );
        }
      } catch (err) {
        console.error("Failed to load data for puzzle form:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditing]);

  const validateForm = (): boolean => {
    if (!title.trim() || !description.trim()) {
      setFormError("Title and Description cannot be empty.");
      return false;
    }
    const hasIncompleteSolution = solution.some((s) => !s[0] || !s[1]);
    if (solution.length === 0 || hasIncompleteSolution) {
      setFormError("At least one complete Solution slot is required.");
      return false;
    }
    if (palette.length < 2) {
      setFormError(
        "The Component Palette must contain at least two components."
      );
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: PuzzlePayload = {
      title,
      description,
      visible,
      lockedComponents: Object.fromEntries(
        locked.filter((item) => item[0] && item[1])
      ),
      slotsToFill: solution.map((s) => s[0]).filter(Boolean),
      componentPalette: palette,
      solution: Object.fromEntries(
        solution.filter((item) => item[0] && item[1])
      ),
    };

    try {
      if (isEditing && id) await updatePuzzle(id, payload);
      else await createPuzzle(payload);
      navigate("/admin/puzzles");
    } catch (err) {
      console.error("Failed to save puzzle", err);
    }
  };

  const handleDynamicFieldChange = (
    setter: Function,
    index: number,
    part: 0 | 1,
    value: string
  ) => {
    setter((prev: [string, string][]) => {
      const newArr = [...prev];
      newArr[index][part] = value;
      return newArr;
    });
  };

  const addLockedField = () => setLocked((prev) => [...prev, ["", ""]]);
  const removeLockedField = (index: number) => {
    if (locked.length > 1) {
      setLocked((prev) => prev.filter((_, i) => i !== index));
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading form...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neonblue">
              {isEditing ? "Edit Puzzle" : "Create New Puzzle"}
            </CardTitle>
            <CardDescription>
              Assemble components from your library into a challenge for
              students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <Input
              placeholder="Puzzle Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Puzzle Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visible"
                checked={visible}
                onCheckedChange={(checked: boolean) => setVisible(checked)}
              />
              <Label htmlFor="visible">Visible to Students</Label>
            </div>

            <div className="space-y-2">
              <Label>Locked Components (Start)</Label>
              {locked.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Slot Name (e.g., CPU)"
                    value={item[0]}
                    onChange={(e) =>
                      handleDynamicFieldChange(
                        setLocked,
                        index,
                        0,
                        e.target.value
                      )
                    }
                  />
                  <Select
                    value={item[1]}
                    onValueChange={(v) =>
                      handleDynamicFieldChange(setLocked, index, 1, v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Component..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allComponents.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {locked.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLockedField(index)}
                    >
                      <FaTrash className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLockedField}
              >
                <FaPlus className="mr-2 h-4 w-4" /> Add Locked Component
              </Button>
            </div>

            <div>
              <Label>Component Palette (Choices for Student)</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
                {allComponents.length > 0 ? (
                  Object.entries(groupedComponents).map(([type, comps]) => (
                    <div key={type}>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {type}
                      </h4>
                      {comps.map((c) => (
                        <div key={c._id} className="flex items-center gap-2">
                          <Checkbox
                            id={`palette-${c._id}`}
                            checked={palette.includes(c._id)}
                            onCheckedChange={(checked) => {
                              setPalette((prev) =>
                                checked
                                  ? [...prev, c._id]
                                  : prev.filter((id) => id !== c._id)
                              );
                            }}
                          />
                          <Label htmlFor={`palette-${c._id}`}>{c.name}</Label>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>No components found in your library.</p>
                    <Button
                      variant="link"
                      asChild
                      className="text-neonblue p-0 h-auto mt-1"
                    >
                      <Link to="/admin/components">
                        Add a component to get started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Solution (Correct Parts for Empty Slots)</Label>
              {solution.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Slot Name (e.g., Motherboard)"
                    value={item[0]}
                    onChange={(e) =>
                      handleDynamicFieldChange(
                        setSolution,
                        index,
                        0,
                        e.target.value
                      )
                    }
                  />
                  <Select
                    value={item[1]}
                    onValueChange={(v) =>
                      handleDynamicFieldChange(setSolution, index, 1, v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Component..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allComponents.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSolution((prev) =>
                        prev.length > 1
                          ? prev.filter((_, i) => i !== index)
                          : prev
                      )
                    }
                  >
                    <FaTrash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSolution((prev) => [...prev, ["", ""]])}
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Solution Slot
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="ghost" asChild>
              <Link to="/admin/puzzles">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              {isEditing ? "Save Changes" : "Create Puzzle"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
export default PuzzleForm;
