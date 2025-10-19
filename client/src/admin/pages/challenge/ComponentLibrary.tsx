import { useState, useEffect, useCallback } from "react";
import {
  fetchAllComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} from "@/services/componentService";
import type {
  IPart, 
  PartPayload,
  ComponentType,
  ComponentTier,
} from "@/types/component.types";
import { Link } from "react-router-dom";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Predefined spec templates per category
const SPEC_TEMPLATES: Record<string, string[]> = {
  case: ["form_factor"],
  cooler: ["supported_sockets", "cooler_tdp"],
  gpu: ["required_psu"],
  motherboard: ["socket", "form_factor", "ddr"],
  processor: ["socket", "tdp", "ddr", "ddr_speed"],
  psu: ["wattage"],
  ram: ["ddr", "speed"],
  storage: [],
};

// Example placeholder values for each spec key
const SPEC_PLACEHOLDERS: Record<string, string> = {
  form_factor: "ATX, Micro-ATX, Mini-ITX",
  supported_sockets: "LGA1700, AM5, etc.",
  cooler_tdp: "e.g., 150",
  required_psu: "e.g., 750",
  socket: "e.g., LGA1700",
  tdp: "e.g., 125",
  ddr: "DDR4 or DDR5",
  ddr_speed: "e.g., 5600",
  wattage: "e.g., 650",
  speed: "e.g., 3200",
};



const ComponentLibrary = () => {
  const [components, setComponents] = useState<IPart[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<IPart | null>(
    null
  );
  const [componentToDelete, setComponentToDelete] = useState<IPart | null>(
    null
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [tier, setTier] = useState<ComponentTier | "">("");
  const [specs, setSpecs] = useState<[string, string][]>([["", ""]]);
  const [formError, setFormError] = useState<string | null>(null);

  const loadComponents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllComponents();
      setComponents(data);
    } catch (err) {
      console.error("Failed to load components:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComponents();
  }, [loadComponents]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setTier("");
    setSpecs([["", ""]]);
  };

  const handleOpenForm = (component: IPart | null) => {
    if (component) {
      setEditingComponent(component);
      setName(component.name);
      setCategory(component.category);
      setTier(component.tier);

      setSpecs(
        component.specs && Object.keys(component.specs).length > 0
          ? Object.entries(component.specs)
          : [["", ""]]
      );
    } else {
      setEditingComponent(null);
      resetForm();
      setSpecs([["", ""]])
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSpecChange = (
    index: number,
    part: "key" | "value",
    value: string
  ) => {
    const newSpecs = [...specs];
    newSpecs[index][part === "key" ? 0 : 1] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => setSpecs([...specs, ["", ""]]);
  const removeSpecField = (index: number) =>
    setSpecs(specs.filter((_, i) => i !== index));

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormError(null);

  console.log("🟡 SUBMIT TRIGGERED");
  console.log("Current State:", {
    name,
    category,
    tier,
    specs,
    editingComponent,
  });

  // ✅ Validation
  if (!name || !category || !tier) {
    console.warn("⚠️ Missing field(s):", { name, category, tier });
    setFormError("Please ensure Name, Category, and Tier are all selected.");
    return;
  }

  const hasIncompleteSpec = specs.some(
    (spec) => (spec[0] && !spec[1]) || (!spec[0] && spec[1])
  );
  if (hasIncompleteSpec) {
    setFormError(
      "Please complete all specification fields or remove any partially filled rows."
    );
    return;
  }

  const finalSpecs = Object.fromEntries(specs.filter((s) => s[0] && s[1]));
  const payload: PartPayload = {
    name,
    category: category as ComponentType,
    tier: tier as ComponentTier,
    specs: finalSpecs,
  };

  console.log("📦 PAYLOAD READY:", payload);

  try {
    if (editingComponent) {
      console.log("🟣 Updating existing component:", editingComponent._id);
      const res = await updateComponent(editingComponent._id, payload);
      console.log("✅ Update success:", res);
    } else {
      console.log("🟢 Creating new component...");
      const res = await createComponent(payload);
      console.log("✅ Create success:", res);
    }

    await loadComponents();
    handleCloseForm();
  } catch (err: any) {
    console.error("❌ Failed to save component:", err.response?.data || err);
    setFormError("Failed to save — check console for error details.");
  }
};


  const handleDelete = async () => {
    if (!componentToDelete) return;
    try {
      await deleteComponent(componentToDelete._id);
      loadComponents();
    } catch (err) {
      console.error("Failed to delete component:", err);
    } finally {
      setComponentToDelete(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neonblue">
            Component Library
          </h1>
          <Button variant="ghost" asChild>
            <Link to="/content/challenges">Back to Hub</Link>
          </Button>
        </div>
        <Card className="border border-neonblue shadow-lg bg-lightbg dark:bg-darkbg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              All Components
            </CardTitle>
            <Button
              onClick={() => handleOpenForm(null)}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              <FaPlus className="mr-2 h-4 w-4" /> Add Component
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {/* ✨ FIX: Added empty state message */}
                {!loading && components.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      No components found. Click "Add Component" to create one.
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  components.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                          {(() => {
                            const cat = c.category.toLowerCase();
                            const acronyms = ["gpu", "psu", "ram"];
                            return acronyms.includes(cat)
                              ? cat.toUpperCase()
                              : cat.charAt(0).toUpperCase() + cat.slice(1);
                          })()}
                      </TableCell>
                      <TableCell>{c.tier}</TableCell>
                      <TableCell className="text-xs">
                        {Object.entries(c.specs || {})
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenForm(c)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setComponentToDelete(c)}
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

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="bg-lightbg dark:bg-darkbg">
          <DialogHeader>
            <DialogTitle className="text-neonblue">
              {editingComponent ? "Edit Component" : "Add New Component"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the PC part.
            </DialogDescription>
          </DialogHeader>
          {/* ✨ 4. Error message is displayed here */}
          {formError && (
            <Alert variant="destructive" className="my-2">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name">Component Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
            <Select
              value={category.toLowerCase()}
              onValueChange={(v) => {
                const selected = v.toLowerCase();
                setCategory(selected);

                // Auto-fill specs when user selects a category
                const defaults = SPEC_TEMPLATES[selected] || [];
                if (defaults.length > 0) {
                  setSpecs(defaults.map((key) => [key, ""]));
                } else {
                  setSpecs([["", ""]]); // fallback for categories without fixed specs
                }
              }}
              required
            >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "processor",
                    "motherboard",
                    "ram",
                    "gpu",
                    "storage",
                    "psu",
                    "cooler",
                    "case",
                  ].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
              <div>
                <Label htmlFor="tier">Tier</Label>
                <Select
                  value={tier}
                  onValueChange={(v: ComponentTier) => setTier(v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["Entry-Level", "Mid-Range", "High-End"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Specifications</Label>
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Spec Key"
                value={spec[0]}
                disabled={SPEC_TEMPLATES[category]?.includes(spec[0])}
              />
                  <Input
                     placeholder={
                   SPEC_PLACEHOLDERS[spec[0]] || "Enter value..."}
                    value={spec[1]}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                  />
                  {specs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecField(index)}
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
                onClick={addSpecField}
              >
                <FaPlus className="mr-2 h-4 w-4" /> Add Spec
              </Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-neonblue text-black hover:bg-hoverprimary"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!componentToDelete}
        onOpenChange={() => setComponentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{componentToDelete?.name}".
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
export default ComponentLibrary;
