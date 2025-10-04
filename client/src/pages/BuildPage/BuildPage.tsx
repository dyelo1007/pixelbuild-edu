import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast from "react-hot-toast";
import { useServerRules } from "@/hooks/useServerRules";

// ✨ shadcn/ui Imports: Add these to your component
import { Button } from "@/components/ui/button"; // Assuming you have this
import { Input } from "@/components/ui/input"; // Assuming you have this
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



// ---------------- TYPES ----------------
type Part = {
  _id: string;
  name: string;
  specs?: {
    form_factor?: string;
    socket?: string;
    tdp?: number;
    ddr?: string;
    ddr_speed?: number;
    wattage?: number;
    required_psu?: number;
    image_url?: string;

    // ✅ add these
    supported_sockets?: string[]; // e.g. ["AM5","LGA1700"]
    cooler_tdp?: number;          // e.g. 170
  };
};


type BuildState = Record<string, Part[]>;

type CompatibilityIssue = {
  type: "error" | "warning" | "info";
  message: string;
  affectedComponents: string[];
  level?: "low" | "medium" | "high";
};

type DragItem = Part & { category: string };

// ---------------- COMPONENT DATA ----------------
// only used to define order
const COMPONENTS: Record<string, Part[]> = {
  case: [],
  motherboard: [],
  processor: [],
  gpu: [],
  ram: [],
  storage: [],
  psu: [],
  cooler: [],
};

const COMPONENT_ORDER = Object.keys(COMPONENTS);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const tooltipMap: Record<string, string> = {
  case: "Holds all components together and ensures airflow.",
  motherboard: "Connects all components and distributes power.",
  processor: "Brain of your PC that handles calculations.",
  gpu: "Handles rendering for games and graphic tasks.",
  ram: "Temporary memory used for fast data access.",
  storage: "Stores your OS, games, and files.",
  psu: "Powers all components in your system.",
  cooler: "Keeps your CPU from overheating.",
};

// ---------------- Compatibility helpers (stateless) --------------
const categoryAlias: Record<string, string> = {
  cpu: "processor",
  mb: "motherboard",
  motherboard: "motherboard",
  processor: "processor",
  ram: "ram",
  gpu: "gpu",
  psu: "psu",
  case: "case",
  cooler: "cooler",
  storage: "storage",
};

// ---------------- UI helpers ----------------
const CompatibilityPanel: React.FC<{ issues: CompatibilityIssue[] }> = ({
  issues,
}) => {
  if (issues.length === 0) {
    return (
      <div className="mb-4 p-3 bg-green-600 dark:bg-green-900 border border-green-400 rounded">
        <div className="text-green-300 font-semibold">✅ All Compatible!</div>
        <div className="text-green-200 text-sm">
          No compatibility issues detected.
        </div>
      </div>
    );
  }
  return (
    <div className="mb-4 space-y-2">
      {issues.map((issue, idx) => (
        <div
          key={idx}
          className={`p-3 rounded border ${
            issue.type === "error"
              ? "bg-red-500 dark:bg-red-900 border-red-400 text-red-200 dark:text-red-300"
              : issue.type === "warning"
              ? "bg-yellow-500 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-400 text-yellow-200 dark:text-yellow-300"
              : "bg-blue-900 border-blue-400 text-blue-300"
          }`}
        >
          <div className="font-semibold">
            {issue.type === "error"
              ? "❌ Incompatible"
              : issue.type === "warning"
              ? "⚠️ Warning"
              : "ℹ️ Info"}
          </div>
          <div className="text-sm">{issue.message}</div>
        </div>
      ))}
    </div>
  );
};


import type { Engine } from "json-rules-engine";

async function checkCompatibility(
  engine: Engine | null,
  build: BuildState
): Promise<CompatibilityIssue[]> {
  if (!engine) return []; // not ready yet

  const case_ = build.case?.[0];
  const mb = build.motherboard?.[0];
  const cpu = build.processor?.[0];
  const ram = build.ram?.[0];
  const gpu = build.gpu?.[0];
  const psu = build.psu?.[0];
  const cooler = build.cooler?.[0];

  const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);
  const ffRank = (ff?: string) => {
    const s = ff?.toLowerCase().replace(/\s/g, "") || "unknown";
    if (s === "atx") return 3;
    if (s === "matx" || s === "microatx") return 2;
    if (s === "mitx" || s === "itx" || s === "miniitx") return 1;
    return 0;
  };
  const normDDR = (d?: string) => (d ? String(d).toUpperCase() : "unknown");
    const normSocket = (s?: string) =>
    s ? String(s).toUpperCase().replace(/\s+/g, "") : "UNKNOWN";
  const coolerSocketList = (p?: Part) => {
    const single = p?.specs?.socket;
    const list = p?.specs?.supported_sockets as string[] | undefined;
    if (Array.isArray(list) && list.length) return list.map(normSocket);
    if (single) return [normSocket(single)];
    return [];
  };

  const facts = {
    caseFormFactorRank: ffRank(case_?.specs?.form_factor),
    mbFormFactorRank: ffRank(mb?.specs?.form_factor),

    cpuDDR: normDDR(cpu?.specs?.ddr),
    mbDDR: normDDR(mb?.specs?.ddr),

    ramSpeed: toNum(ram?.specs?.ddr_speed),
    mbMaxRamSpeed: toNum((mb?.specs as any)?.max_ddr_speed ?? mb?.specs?.ddr_speed),
    cpuMaxRamSpeed: toNum((cpu?.specs as any)?.max_ddr_speed ?? cpu?.specs?.ddr_speed),

    psuWattage: toNum(psu?.specs?.wattage),
    gpuRequiredWattage: toNum(gpu?.specs?.required_psu),
    gpuRequiredWattagePlus100: toNum(gpu?.specs?.required_psu) + 100,
        cpuSocket: normSocket(cpu?.specs?.socket),
    coolerSockets: coolerSocketList(cooler),
    // boolean is computed on backend with a fact, but engine rules can still work
    // using only cpuSocket + coolerSockets + rule guards
    cpuTdp: toNum(cpu?.specs?.tdp),
    coolerTdp: toNum(cooler?.specs?.cooler_tdp),
  };

  try {
    const { events } = await engine.run(facts);
    return events.map((e: any) => ({
      type: (e.type as "error" | "warning" | "info") || "info",
      message: e.params?.message || "Unknown issue",
      affectedComponents: e.params?.affectedComponents || [],
    }));
  } catch (err) {
    console.error("❌ Engine run failed:", err, "with facts:", facts);
    return [];
  }
}



// ---------------- MAIN PAGE ----------------
export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  const [build, setBuild] = useState<BuildState>(
    COMPONENT_ORDER.reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as BuildState
    )
  );
  const { engineRef, ready: rulesReady } = useServerRules();
  const [loadedBuildName, setLoadedBuildName] = useState("");

  // states for each category
  const [cases, setCases] = useState<Part[]>([]);
  const [motherboards, setMotherboards] = useState<Part[]>([]);
  const [processors, setProcessors] = useState<Part[]>([]);
  const [gpus, setGpus] = useState<Part[]>([]);
  const [rams, setRams] = useState<Part[]>([]);
  const [storages, setStorages] = useState<Part[]>([]);
  const [psus, setPsus] = useState<Part[]>([]);
  const [coolers, setCoolers] = useState<Part[]>([]);

  const { id } = useParams(); // build ID
  const token = localStorage.getItem("token"); // or however you store it
  const [showSummary, setShowSummary] = useState(false);
  const [message, setMessage] = useState("");

  const currentCategory = COMPONENT_ORDER[step];
  const [compatibilityIssues, setCompatibilityIssues] = useState<CompatibilityIssue[]>([]);

// De-dupe by (type + message + affectedComponents)
function uniqueIssues(list: CompatibilityIssue[]): CompatibilityIssue[] {
  const keyOf = (i: CompatibilityIssue) =>
    `${i.type}|${i.message}|${[...i.affectedComponents].sort().join(",")}`;
  const map = new Map<string, CompatibilityIssue>();
  for (const i of list) map.set(keyOf(i), i);
  return [...map.values()];
}
  // 🔹 NEW: Run backend check whenever build changes
async function runAllCompatibilityChecks(build: BuildState): Promise<CompatibilityIssue[]> {
  const backendIssues = await fetchCompatibility(build);
  const engineIssues = rulesReady && engineRef.current
    ? await checkCompatibility(engineRef.current, build)
    : [];
  const instantIssues: CompatibilityIssue[] = [];

  return uniqueIssues([...backendIssues, ...engineIssues, ...instantIssues]);
}


// effect to run whenever build changes
useEffect(() => {
  const runChecks = async () => {
    if (Object.values(build).some(parts => parts.length > 0)) {
      const allIssues = await runAllCompatibilityChecks(build);
      setCompatibilityIssues(allIssues);
    } else {
      setCompatibilityIssues([]);
    }
  };
  runChecks();
}, [build]);

  useEffect(() => {
    const fetchParts = async (
      category: string,
      setter: React.Dispatch<React.SetStateAction<Part[]>>
    ) => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/parts?category=${category}`
        );
        const data = await res.json();
        const mapped = data.map((item: any) => {
          const token =
            item.specs?.form_factor &&
            typeof item.specs.form_factor === "string"
              ? item.specs.form_factor.toLowerCase().replace(/[^a-z0-9]/g, "")
              : null;

          return {
            _id: item._id,
            name: `${item.name}${token ? ` (${item.specs.form_factor})` : ""}`,
            specs: item.specs || {},
          } as Part;
        });

        setter(mapped);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      }
    };

    // ✅ Clear all lists when switching category
    setCases([]);
    setMotherboards([]);
    setProcessors([]);
    setGpus([]);
    setRams([]);
    setStorages([]);
    setPsus([]);
    setCoolers([]);

    // ✅ Fetch only the current category
    switch (currentCategory) {
      case "case":
        fetchParts("case", setCases);
        break;
      case "motherboard":
        fetchParts("motherboard", setMotherboards);
        break;
      case "processor":
        fetchParts("processor", setProcessors); // note: backend uses "cpu"
        break;
      case "gpu":
        fetchParts("gpu", setGpus);
        break;
      case "ram":
        fetchParts("ram", setRams);
        break;
      case "storage":
        fetchParts("storage", setStorages);
        break;
      case "psu":
        fetchParts("psu", setPsus);
        break;
      case "cooler":
        fetchParts("cooler", setCoolers);
        break;
    }
  }, [currentCategory]);

  const getPartsForCategory = (category: string): Part[] => {
    switch (category) {
      case "case":
        return cases;
      case "motherboard":
        return motherboards;
      case "processor":
        return processors;
      case "gpu":
        return gpus;
      case "ram":
        return rams;
      case "storage":
        return storages;
      case "psu":
        return psus;
      case "cooler":
        return coolers;
      default:
        return [];
    }
  };

  // Helper to get part name by id (searches both fetched and hardcoded)
  const getPartName = (partId: string, category: string): string => {
    const list = getPartsForCategory(category);
    const found = list.find((p) => p._id === partId);
    return found ? found.name : "";

  };

// main function to get backend issues
async function fetchCompatibility(build: BuildState): Promise<CompatibilityIssue[]> {
  try {
    const res = await fetch("http://localhost:5000/api/compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ build }),
    });
    const data = await res.json();
    return data.issues || [];
  } catch (err) {
    console.error("❌ Compatibility check failed", err);
    return [];
  }
}


  useEffect(() => {
    const fetchBuild = async () => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/savedbuilds/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to load build");
        const data = await res.json();

        setLoadedBuildName(data.name || ""); // Store the name here

        // Prepare an initially-empty BuildState
        const prefilled: BuildState = COMPONENT_ORDER.reduce(
          (acc, category) => {
            acc[category] = [];
            return acc;
          },
          {} as BuildState
        );

        // Collect promises for any ID-based fetches
        const fetchPromises: Promise<void>[] = [];

        for (const category of COMPONENT_ORDER) {
          const saved = data.parts?.[category];

          // Case A: saved is a populated object (from .populate)
          if (saved && typeof saved === "object" && !Array.isArray(saved)) {
            const obj: any = saved;
            const name = obj.name
              ? `${obj.name}${
                  obj.specs?.form_factor ? ` (${obj.specs.form_factor})` : ""
                }`
              : obj._id || "";
            prefilled[category] = [{
              _id: obj._id || "",
              name,
              specs: obj.specs || {}
            }];
            continue;
          }

          // Case B: saved is an array of ids (or single string inside array)
          if (Array.isArray(saved) && saved.length > 0) {
            const _id: string = saved[0];
            // Fetch the part details for that id (parallel)
            const p = (async () => {
              try {
                const r = await fetch(
                  `http://localhost:5000/api/parts/${encodeURIComponent(_id)}`
                );
                if (!r.ok) throw new Error(`Part ${_id} fetch failed`);
                const item = await r.json();
                const name = item.name
                  ? `${item.name}${
                      item.specs?.form_factor
                        ? ` (${item.specs.form_factor})`
                        : ""
                    }`
                  : _id;
                prefilled[category] = [{ _id: item._id || _id, name }];
              } catch (err) {
                console.warn("Could not fetch part", _id, err);
                prefilled[category] = [{ _id, name: "" }];
              }
            })();
            fetchPromises.push(p);
            continue;
          }

          // Case C: saved is a plain string id
          if (typeof saved === "string" && saved.trim().length > 0) {
            const _id = saved;
            const p = (async () => {
              try {
                const r = await fetch(
                  `http://localhost:5000/api/parts/${encodeURIComponent(_id)}`
                );
                if (!r.ok) throw new Error(`Part ${_id} fetch failed`);
                const item = await r.json();
                const name = item.name
                  ? `${item.name}${
                      item.specs?.form_factor
                        ? ` (${item.specs.form_factor})`
                        : ""
                    }`
                  : _id;
                prefilled[category] = [{ _id: item._id || _id, name }];
              } catch (err) {
                console.warn("Could not fetch part", _id, err);
                prefilled[category] = [{ _id, name: "" }];
              }
            })();
            fetchPromises.push(p);
            continue;
          }

          // Otherwise: nothing saved for this category
          prefilled[category] = [];
        }

        // Wait for all part-detail fetches to finish
        if (fetchPromises.length) await Promise.all(fetchPromises);

        // Finally set build state
        setBuild(prefilled);
      } catch (err) {
        console.error("Failed to load build:", err);
      }
    };

    fetchBuild();
  }, [id, token]);

// Get compatibility status for the preview icons/colors
const getCompatibilityStatus = async (
  partId: string,
  category: string,
  b: BuildState
): Promise<"compatible" | "warning" | "incompatible"> => {
  const list = getPartsForCategory(category);
  const found = list.find((p) => p._id === partId);

  const tempBuild: BuildState = {
    ...b,
    [category]: [
      {
        _id: partId,
        name: found ? found.name : getPartName(partId, category) || "",
        specs: found ? found.specs : {},
      },
    ],
  };

  const issues = await runAllCompatibilityChecks(tempBuild);

  // 🔹 Normalize categories before comparing
  const normalizedCategory = categoryAlias[category] || category;

  const relevant = issues.filter((i) =>
    i.affectedComponents.some(
      (comp) =>
        comp === normalizedCategory ||
        categoryAlias[comp] === normalizedCategory
    )
  );


  if (relevant.some((i) => i.type === "error")) return "incompatible";
  if (relevant.some((i) => i.type === "warning")) return "warning";
  return "compatible";
};

  // ---------------- DRAGGABLE ----------------
const DraggablePart: React.FC<{
  part: Part;
  category: string;
  build: BuildState;
}> = ({ part, category, build }) => {
  const [compatibility, setCompatibility] = useState<
    "compatible" | "warning" | "incompatible"
  >("compatible");

  useEffect(() => {
    const runCheck = async () => {
      const result = await getCompatibilityStatus(part._id, category, build);
      setCompatibility(result);
    };
    runCheck();
  }, [part._id, category, build]);

  const getColor = () =>
    compatibility === "compatible"
      ? "bg-lightbgfill dark:bg-gray-800 border-l-neonblue"
      : compatibility === "warning"
      ? "bg-yellow-200 dark:bg-yellow-900 border-l-yellow-400"
      : "bg-red-200 dark:bg-red-900 border-l-red-400";

  const getIcon = () =>
    compatibility === "compatible"
      ? "✅"
      : compatibility === "warning"
      ? "⚠️"
      : "❌";

  const [{ isDragging }, drag] = useDrag({
    type: "PART",
    item: { ...part, category },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      title={tooltipMap[category]}
      className={`p-2 mb-2 border-l-4 border rounded cursor-grab text-neonblue dark:text-white text-sm opacity-${
        isDragging ? "40" : "100"
      } ${getColor()}`}
    >
      <span className="mr-2">{getIcon()}</span>
      {part.name}
    </div>
  );
};


  // ---------------- DROP SLOT ----------------
  const DropSlot: React.FC<{
    category: string;
    part: Part[];
    build: BuildState;
    onDropPart: (item: DragItem) => void;
    isRendering: boolean;
  }> = ({ category, part, build, onDropPart, isRendering }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "PART",
      drop: (item: DragItem) => onDropPart(item),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    });

    const allComponents = Object.values(build)
      .flat()
      .map((c) => c.name)
      .join(" + ");

    return (
      <div
        ref={drop}
        className={`w-full h-64 border-dashed border-2 p-4 flex flex-col justify-center items-center text-center text-sm ${
          isOver ? "border-blue-400" : "border-white"
        }`}
      >
        <div className="w-32 h-32 bg-gray-700 rounded mb-2 flex items-center justify-center text-white text-xs">
          [Image Placeholder]
        </div>

        <p className="text-green-400 mb-2">
          {isRendering ? "Rendering..." : allComponents || "No components yet"}
        </p>

        {part.length > 0 ? (
          <>
            <span className="text-white text-sm font-bold mb-1">
              ✅ You added: {part[0].name}
            </span>
            <span className="text-xs text-gray-400 italic">
              Only one {category} can be added.
            </span>
          </>
        ) : (
          <span className="italic text-gray-400">{`< Drop your ${category} here >`}</span>
        )}

        {tooltipMap[category] && (
          <div className="mt-2 text-xs text-yellow-400 italic">
            💡 {tooltipMap[category]}
          </div>
        )}
      </div>
    );
  };
  // ---------------- SUMMARY PAGE ----------------
  const SummaryPage: React.FC<{
    build: BuildState;
    issues: CompatibilityIssue[];
    onBack: () => void;
    loadedBuildName: string;
  }> = ({ build, issues, onBack, loadedBuildName }) => {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [buildName, setBuildName] = useState("");
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleSaveBuild = async () => {
      if (!buildName.trim()) {
        toast.error("Please enter a name for your build.");
        return;
      }
      try {
        const response = await fetch(
          id
            ? `http://localhost:5000/api/savedbuilds/${id}`
            : "http://localhost:5000/api/savedbuilds",
          {
            method: id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: buildName,
              parts: Object.fromEntries(
                Object.entries(build).map(([category, parts]) => [
                  category,
                  parts.map((p) => p._id),
                ])
              ),
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to save build");
        toast.success("✅ Build saved successfully!");
        setIsSaveModalOpen(false);
        navigate("/account-settings");
      } catch (err) {
        console.error("Error saving build:", err);
        toast.error("❌ Could not save build");
      }
    };
    return (
      <>
        <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-lightbgfill dark:bg-darkbg border-neonblue/20">
            <DialogHeader>
              <DialogTitle className="text-neonblue">
                Save Your Build
              </DialogTitle>
              <DialogDescription>
                Give your new PC build a unique name. You can change it later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="e.g., Ultimate Gaming Rig"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSaveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveBuild} disabled={!buildName.trim()}>
                Save Build
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="min-h-screen bg-lightbgfill dark:bg-darkbg text-white px-8 py-6 rounded-2xl border">
          <h1 className="text-2xl font-bold text-neonblue mb-4">
            📋 Build Summary
          </h1>

          {/* Build List */}
          {Object.entries(build).map(([category, parts]) => (
            <div
              key={category}
              className="mb-3 p-3 border border-neonblue rounded bg-neonblue/50 dark:bg-darkbg"
            >
              <h2 className="text-neonblue dark:text-neonblue text-lg font-semibold mb-2">
                {category.toUpperCase()}
              </h2>
              {parts.length > 0 ? (
                <p className="dark:text-green-400">✅ {parts[0].name}</p>
              ) : (
                <p className="text-gray-500 italic">Not Selected</p>
              )}
            </div>
          ))}

          {/* Compatibility Issues Recap */}
          <div className="mt-6">
            <h3 className="text-yellow-400 font-bold mb-2">
              ⚠️ Compatibility Check
            </h3>
            {issues.length === 0 ? (
              <p className="text-green-400">✅ No issues detected.</p>
            ) : (
              <ul className="space-y-2">
                {issues.map((issue, idx) => (
                  <li
                    key={idx}
                    className={`p-2 rounded border ${
                      issue.type === "error"
                        ? "bg-red-900 border-red-400 text-red-300"
                        : issue.type === "warning"
                        ? "bg-yellow-500 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-400 text-yellow-200 dark:text-yellow-300"
                        : "bg-blue-900 border-blue-400 text-blue-300"
                    }`}
                  >
                    {/* "bg-yellow-500 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-400 text-yellow-200 dark:text-yellow-300" */}
                    <strong>
                      {issue.type === "error"
                        ? "❌ Incompatible"
                        : issue.type === "warning"
                        ? "⚠️ Warning"
                        : "ℹ️ Info"}
                    </strong>
                    : {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Extra Info */}
          <div className="mt-6 p-4 bg-neonblue/90 dark:bg-gray-800 rounded border border-neonblue dark:border-gray-600">
            <h3 className="text-yellow-400 font-bold mb-2">ℹ️ Extra Info</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>
                Total components selected:{" "}
                {Object.values(build).filter((p) => p.length > 0).length}
              </li>
              <li>Date: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onBack}>
              ◀ Back to Build
            </Button>
            <Button
              onClick={() => {
                const hasParts = Object.values(build).some(
                  (parts) => parts.length > 0
                );
                if (!hasParts) {
                  toast.error(
                    "❌ You must add at least one component before saving."
                  );
                  return;
                }

                setBuildName(id ? loadedBuildName : "");
                setIsSaveModalOpen(true);
              }}
            >
              💾 {id ? "Update Build" : "Save Build"}{" "}
              {/* Optional: change button text */}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/guides")}>
              📘 Guides
            </Button>
          </div>
        </div>
      </>
    );
  };

  // ---------------- Drop handler ----------------
// ---------------- Drop handler ----------------
const onDropPart = (item: DragItem) => {
  if (build[item.category].length > 0) return;
  setIsRendering(true);

  setTimeout(async () => {
    // 1) Update build with the dropped part
    const updatedBuild: BuildState = {
      ...build,
      [item.category]: [{ _id: item._id, name: item.name, specs: item.specs || {} }],
    };
    setBuild(updatedBuild);

    // 2) Run ALL checks (backend + local engine + quick)
    const allIssues = await runAllCompatibilityChecks(updatedBuild);
    setCompatibilityIssues(allIssues);

    // 3) Inline success message (auto-clear)
    setMessage(`✅ Added ${item.name} to ${capitalize(item.category)}`);
    setTimeout(() => setMessage(""), 2000);

    setIsRendering(false);

    // 4) Auto-advance to next step
    if (step < COMPONENT_ORDER.length - 1) {
      setTimeout(() => setStep((prev) => prev + 1), 500);
    }
  }, 500);
};


  // render
  if (showSummary) {
    return (
      <SummaryPage
        build={build}
        issues={compatibilityIssues}
        onBack={() => setShowSummary(false)}
        loadedBuildName={loadedBuildName}
      />
    );
  }

  // Determine parts to show in the left sidebar for current category
  const partsToRender = getPartsForCategory(currentCategory);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-lightbg dark:bg-darkbg text-white px-8 py-6 font-mono rounded-2xl border">
        <div className="text-neonblue text-2xl font-bold mb-4">Pixel Build</div>

        <div className="mb-4 text-sm text-gray-400">
          Step {step + 1} of {COMPONENT_ORDER.length} – Add{" "}
          {capitalize(currentCategory)}
        </div>

        <CompatibilityPanel issues={compatibilityIssues} />

        <div className="flex justify-between gap-4">
          {/* Sidebar */}
          <div className="w-1/5 border-2 border-neonblue p-4 rounded">
            <h2 className="text-neonblue text-md font-semibold mb-2">
              {currentCategory.toUpperCase()}
            </h2>
            <div className="mb-3 text-xs text-gray-400 dark:text-gray-300">
              <div>✅ Compatible</div>
              <div>⚠️ Warning</div>
              <div>❌ Incompatible</div>
            </div>
            <div className="space-y-2">
              {partsToRender.length === 0 ? (
                <div className="text-gray-500 italic text-sm">Loading...</div>
              ) : (
                partsToRender.map((part, index) => (
                  <DraggablePart
                    key={part._id || index}
                    part={part}
                    category={currentCategory}
                    build={build}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-between mt-4 gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-3 py-1 rounded border border-neonblue text-neonblue bg-lightbgfill/50 hover:bg-neonblue/60 hover:text-white dark:hover:bg-gray-800 dark:bg-darkbg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ◀ Prev
              </button>
              <span className="text-xs text-gray-400">
                {step + 1} / {COMPONENT_ORDER.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setStep((s) => Math.min(COMPONENT_ORDER.length - 1, s + 1))
                }
                disabled={step === COMPONENT_ORDER.length - 1}
                className="px-3 py-1 rounded border bg-lightbgfill/50 border-neonblue text-neonblue hover:text-white hover:bg-neonblue/60 dark:hover:bg-gray-800 dark:bg-darkbg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* Drop Area */}
          <div className="w-3/5 border border-neonblue p-4 rounded space-y-4">
            <DropSlot
              category={currentCategory}
              part={build[currentCategory]}
              build={build}
              onDropPart={onDropPart}
              isRendering={isRendering}
            />

            <div className="flex gap-3 mt-4 justify-center">
              <button
                onClick={() => {
                  const hasParts = Object.values(build).some(
                    (parts) => parts.length > 0
                  );
                  if (!hasParts) {
                    alert(
                      "❌ You must add at least one component before finishing."
                    );
                    return;
                  }
                  setShowSummary(true);
                }}
                className="px-6 py-2 rounded border-2 bg-lightbgfill dark:bg-darkbg border-neonblue text-neonblue hover:neonblue-900"
              >
                ✅ Finish Build
              </button>
            </div>
            {message && (
              <div className="mt-2 text-green-400 text-sm">{message}</div>
            )}
          </div>

          {/* Mini Summary Sidebar */}
          <div className="w-1/5 border-2 dark:text-white text-neonblue border-neonblue p-4 rounded text-center">
            <h2 className="font-bold mb-2">Your Build</h2>
            {COMPONENT_ORDER.map((key, index) => (
              <div key={index} className="text-sm">
                {build[key].length > 0
                  ? `${capitalize(key)}: ${build[key][0].name}`
                  : `${capitalize(key)}: None`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
