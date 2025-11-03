import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchAllComponents } from "@/services/componentService";
import {
  createPuzzle,
  updatePuzzle,
  fetchPuzzleById,
} from "@/services/puzzleService";
import type { IPart } from "@/types/component.types";
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
import { Engine } from "json-rules-engine";

// ✅ Import rules from server
import rulesData from "../../../../../server/src/controllers/compatibilityLogic.json";

// ✅ Normalized compatibility helpers (identical logic to BuildPage)

const normalizeFactsForPuzzle = (locked: any, testPart: any) => {
  const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);
  const ffRank = (ff?: string) => {
    const s = ff?.toLowerCase().replace(/\s/g, "") || "unknown";
    if (s === "atx") return 3;
    if (s === "matx" || s === "microatx") return 2;
    if (s === "mitx" || s === "itx" || s === "miniitx") return 1;
    return 0;
  };

  // IMPORTANT: match the exact sentinel used in your rules file
  // (logic.json uses "unknown" lowercase for DDR)
  const norm = (v?: string) =>
    v ? String(v).trim().toUpperCase().replace(/\s+/g, "") : "UNKNOWN";
  const normDDR = (d?: string) =>
    d ? String(d).trim().toUpperCase() : "unknown"; // <-- lowercase "unknown"
  const coolerSocketList = (p?: any) => {
    const single = p?.specs?.socket;
    const list = p?.specs?.supported_sockets as string[] | undefined;
    if (Array.isArray(list) && list.length) return list.map(norm);
    if (single) return [norm(single)];
    return [];
  };

  // merge locked components + testPart into one build object
  const build = { ...locked };
  if (testPart?.category) {
    build[testPart.category.toLowerCase()] = [testPart];
  }

  const cpu = build.processor?.[0];
  const mb = build.motherboard?.[0];
  const ram = build.ram?.[0];
  const gpu = build.gpu?.[0];
  const psu = build.psu?.[0];
  const cooler = build.cooler?.[0];
  const pcCase = build.case?.[0];

  const cpuSocketStr = norm(cpu?.specs?.socket);
  const mbSocketStr = norm(mb?.specs?.socket);
  const coolerList = coolerSocketList(cooler);
  const coolerSupportsCpu =
    cpuSocketStr !== "UNKNOWN" && coolerList.length > 0
      ? coolerList.includes(cpuSocketStr)
      : true;

  return {
    caseFormFactorRank: ffRank(pcCase?.specs?.form_factor),
    mbFormFactorRank: ffRank(mb?.specs?.form_factor),

    // DDR consistency — note the lowercase "unknown" default
    cpuDDR: normDDR(cpu?.specs?.ddr),
    mbDDR: normDDR(mb?.specs?.ddr),
    ramDDR: normDDR(ram?.specs?.ddr),

    // Sockets
    cpuSocket: cpuSocketStr,
    mbSocket: mbSocketStr,

    // RAM / PSU / TDP
    ramSpeed: toNum(ram?.specs?.speed ?? ram?.specs?.ddr_speed),
    mbMaxRamSpeed: toNum(mb?.specs?.max_ddr_speed ?? mb?.specs?.ddr_speed),
    cpuMaxRamSpeed: toNum(cpu?.specs?.max_ddr_speed ?? cpu?.specs?.ddr_speed),
    psuWattage: toNum(psu?.specs?.wattage),
    gpuRequiredWattage: toNum(gpu?.specs?.required_psu),
    gpuRequiredWattagePlus100: toNum(gpu?.specs?.required_psu) + 100,

    // Cooler support
    coolerSockets: coolerList,
    coolerSupportsCpu,
    cpuTdp: toNum(cpu?.specs?.tdp),
    coolerTdp: toNum(cooler?.specs?.cooler_tdp),
  };
};

const runPuzzleCompatibility = async (engine: Engine, lockedBuild: any, testPart: any) => {
  if (!engine) return [];
  const facts = normalizeFactsForPuzzle(lockedBuild, testPart);

  // DEBUG: log facts so you can inspect what's actually being sent
  // (remove or wrap with env check in production)
  console.debug("🧾 Running compatibility - facts:", facts);

  const safeFacts: Record<string, any> = new Proxy(facts, {
    get(target, prop: string) {
      return prop in target ? (target as any)[prop] : "UNKNOWN";
    },
  });

  try {
    const { events } = await engine.run(safeFacts);
    const errors = events
      .filter((e: any) => e.type === "error" && e.params?.message)
      .map((e: any) => ({
        message: e.params.message,
        affected: e.params?.affectedComponents || [],
      }));
    return errors;
  } catch (err: any) {
    console.error("❌ Puzzle compatibility run error:", err.message || err);
    return [{ message: "Engine crashed running rules", affected: [] }];
  }
};

const PuzzleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [allComponents, setAllComponents] = useState<IPart[]>([]);
  const [groupedComponents, setGroupedComponents] = useState<
    Record<string, IPart[]>
  >({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState<[string, string][]>([["", ""]]);
  const [palette, setPalette] = useState<string[]>([]);
  const [solution, setSolution] = useState<[string, string][]>([["", ""]]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // ✅ Compatibility setup
  const engineRef = useRef<Engine | null>(null);
  const [rulesReady, setRulesReady] = useState(false);
  const [compatibleParts, setCompatibleParts] = useState<
    Record<string, string[]>
  >({});

  // ✅ Load compatibility rules
  useEffect(() => {
    try {
      const engine = new Engine(rulesData);
      engine.on("error", (event,) => {
  console.warn("⚠️ Engine caught internal error event:", event);
});
      engineRef.current = engine;
      setRulesReady(true);
    } catch (err) {
      console.error("❌ Error loading compatibility rules:", err);
    }
  }, []);

  // ✅ Fetch parts and puzzle
  useEffect(() => {
    const loadData = async () => {
      try {
        const components = await fetchAllComponents();
        setAllComponents(components);
        setGroupedComponents(groupBy(components, "category"));

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
        console.error("❌ Failed to load data for puzzle form:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditing]);

 useEffect(() => {
  const computeCompatible = async () => {
    if (!rulesReady || !engineRef.current || allComponents.length === 0) return;

    // ✅ Only compute once a locked part exists
    const hasLockedParts = locked.some(([slot, compId]) => slot && compId);
    if (!hasLockedParts) {
      // nothing locked yet → everything is compatible
      const allMap: Record<string, string[]> = {};
      for (const [cat, comps] of Object.entries(groupedComponents)) {
        allMap[cat.toLowerCase()] = comps.map((c) => c._id);
      }
      setCompatibleParts(allMap);
      return;
    }

    const engine = engineRef.current;
    const lockedBuild: Record<string, any[]> = {};

    locked.forEach(([slot, compId]) => {
      const comp = allComponents.find((x) => x._id === compId);
      if (comp) lockedBuild[slot.toLowerCase()] = [comp];
    });

    const newMap: Record<string, string[]> = {};

    for (const [category, comps] of Object.entries(groupedComponents)) {
      const validIds: string[] = [];
      for (const part of comps) {
        const issues = await runPuzzleCompatibility(engine, lockedBuild, part);
        if (issues.length === 0) validIds.push(part._id);
      }
      newMap[category.toLowerCase()] = validIds;
    }

    setCompatibleParts(newMap);
  };

  computeCompatible();
}, [locked, groupedComponents, rulesReady, allComponents]);




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
      if (isEditing && id) {
        await updatePuzzle(id, payload);
      } else {
        await createPuzzle(payload);
      }
      navigate("/admin/puzzles");
    } catch (err) {
      console.error("❌ Failed to save puzzle", err);
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

  if (loading) return <div className="p-6 text-center">Loading form...</div>;

  const formatCategory = (text: string) => {
    if (!text) return "";
    const acronyms = ["GPU", "PSU", "RAM", "SSD", "HDD"];
    const upper = text.toUpperCase();
    if (acronyms.includes(upper)) return upper;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

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

            {/* ✅ Locked Components */}
      <div className="space-y-2">
              <Label>Locked Components (Start)</Label>
              {locked.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={item[0]}
                    onValueChange={(v) =>
                      handleDynamicFieldChange(setLocked, index, 0, v)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(groupedComponents).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {formatCategory(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={item[1]}
                    onValueChange={(v) =>
                      handleDynamicFieldChange(setLocked, index, 1, v)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Component..." />
                    </SelectTrigger>
               <SelectContent>
  {allComponents
    .filter((c) => c.category === item[0])
    .filter((c) => {
      if (!rulesReady) return true;
      const cat = c.category.toLowerCase();
      return compatibleParts[cat]?.includes(c._id);
    })
    .map((c) => (
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

            {/* ✅ Component Palette */}
            <div>
              <Label>Component Palette (Choices for Student)</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
                {allComponents.length > 0 ? (
                  Object.entries(groupedComponents).map(([type, comps]) => (
                    <div key={type}>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {formatCategory(type)}
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

            {/* ✅ Solution Section */}
            <div className="space-y-2">
              <Label>Solution (Correct Parts for Empty Slots)</Label>

              {solution.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  {/* Category Dropdown */}
                  <Select
                    value={item[0]}
                    onValueChange={(v) =>
                      handleDynamicFieldChange(setSolution, index, 0, v)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(groupedComponents).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {formatCategory(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Component Dropdown with compatibility */}
                  <Select
                    value={item[1]}
                    onValueChange={(v) =>
                      handleDynamicFieldChange(setSolution, index, 1, v)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Compatible Component..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allComponents
                        .filter((c) => c.category === item[0])
                        .filter((c) => {
                          if (!rulesReady) return true;
                          const cat = c.category.toLowerCase();
                          return compatibleParts[cat]?.includes(c._id);
                        })
                        .map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {solution.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSolution((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
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
                onClick={() => setSolution((prev) => [...prev, ["", ""]])}
              >
                <FaPlus className="mr-2 h-4 w-4" /> Add Solution Slot
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
