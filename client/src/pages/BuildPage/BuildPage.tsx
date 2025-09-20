import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// ---------------- TYPES ----------------
type Part = {
  id: string;
  name: string;
};

type BuildState = Record<string, Part[]>;

type CompatibilityIssue = {
  type: "error" | "warning" | "info";
  message: string;
  affectedComponents: string[];
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

// ---------------- Compatibility helpers (stateless) ----------------
const getFormFactor = (idOrName: string): string => {
  const s = (idOrName || "").toLowerCase();
  if (s.includes("atx") && !s.includes("matx")) return "ATX";
  if (s.includes("matx")) return "mATX";
  if (s.includes("itx")) return "ITX";
  return "unknown";
};

const getDDRType = (idOrName: string): string => {
  const s = (idOrName || "").toLowerCase();
  if (s.includes("ddr5")) return "DDR5";
  if (s.includes("ddr4")) return "DDR4";
  return "unknown";
};

const getDDRSpeed = (idOrName: string): number => {
  const match = idOrName.match(/(\d{4,5})/);
  return match ? parseInt(match[1]) : 0;
};

const getPSUWattage = (idOrName: string): number => {
  const match = idOrName.match(/(\d+)w/i);
  return match ? parseInt(match[1]) : 0;
};

const getRequiredPSU = (idOrName: string): number => {
  const match = idOrName.match(/(\d+)W PSU/i);
  return match ? parseInt(match[1]) : 0;
};

// ---------------- UI helpers ----------------
const CompatibilityPanel: React.FC<{ issues: CompatibilityIssue[] }> = ({
  issues,
}) => {
  if (issues.length === 0) {
    return (
      <div className="mb-4 p-3 bg-green-900 border border-green-400 rounded">
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
              ? "bg-red-900 border-red-400 text-red-300"
              : issue.type === "warning"
              ? "bg-yellow-900 border-yellow-400 text-yellow-300"
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

  // states for each category
  const [cases, setCases] = useState<Part[]>([]);
  const [motherboards, setMotherboards] = useState<Part[]>([]);
  const [processors, setProcessors] = useState<Part[]>([]);
  const [gpus, setGpus] = useState<Part[]>([]);
  const [rams, setRams] = useState<Part[]>([]);
  const [storages, setStorages] = useState<Part[]>([]);
  const [psus, setPsus] = useState<Part[]>([]);
  const [coolers, setCoolers] = useState<Part[]>([]);

  const [showSummary, setShowSummary] = useState(false);
  const [message, setMessage] = useState("");

  const currentCategory = COMPONENT_ORDER[step];

  // Fetch from backend
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
    item.specs?.form_factor && typeof item.specs.form_factor === "string"
      ? item.specs.form_factor.toLowerCase().replace(/[^a-z0-9]/g, "")
      : null;

  return {
    id: String(item._id ?? crypto.randomUUID()) + (token ? `-${token}` : ""),
    name: `${item.name}${token ? ` (${item.specs.form_factor})` : ""}`,
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
    const found = list.find((p) => p.id === partId);
    return found ? found.name : "";
  };

  // Compatibility checker using the stateless helpers above
  const checkCompatibility = (b: BuildState): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    const case_ = b.case[0];
    const motherboard = b.motherboard[0];
    const cpu = b.processor[0];
    const gpu = b.gpu[0];
    const ram = b.ram[0];
    const psu = b.psu[0];

    if (case_ && motherboard) {
      const caseFormFactor = getFormFactor(case_.id + " " + case_.name);
      const mbFormFactor = getFormFactor(motherboard.id + " " + motherboard.name);
      const hierarchy: Record<string, number> = { ATX: 3, mATX: 2, ITX: 1, unknown: 0 };
      if ((hierarchy[caseFormFactor] || 0) < (hierarchy[mbFormFactor] || 0)) {
        issues.push({
          type: "error",
          message: `${mbFormFactor} motherboard won't fit in ${caseFormFactor} case`,
          affectedComponents: ["case", "motherboard"],
        });
      }
    }

    if (cpu && motherboard) {
      const cpuDDR = getDDRType(cpu.name + " " + cpu.id);
      const mbDDR = getDDRType(motherboard.name + " " + motherboard.id);
      if (cpuDDR !== mbDDR && cpuDDR !== "unknown" && mbDDR !== "unknown") {
        issues.push({
          type: "error",
          message: `CPU supports ${cpuDDR} but motherboard supports ${mbDDR}`,
          affectedComponents: ["processor", "motherboard"],
        });
      }
    }

    if (ram && motherboard) {
      const ramSpeed = getDDRSpeed(ram.id + " " + ram.name);
      const mbMaxSpeed = getDDRSpeed(motherboard.name + " " + motherboard.id);
      if (ramSpeed > mbMaxSpeed && mbMaxSpeed > 0) {
        issues.push({
          type: "warning",
          message: `RAM speed (${ramSpeed}) exceeds motherboard max (${mbMaxSpeed})`,
          affectedComponents: ["ram", "motherboard"],
        });
      }
    }

    if (cpu && ram) {
      const cpuMaxSpeed = getDDRSpeed(cpu.name + " " + cpu.id);
      const ramSpeed = getDDRSpeed(ram.id + " " + ram.name);
      if (ramSpeed > cpuMaxSpeed && cpuMaxSpeed > 0) {
        issues.push({
          type: "warning",
          message: `RAM speed (${ramSpeed}) exceeds CPU spec (${cpuMaxSpeed})`,
          affectedComponents: ["processor", "ram"],
        });
      }
    }

    if (psu && gpu) {
      const psuWattage = getPSUWattage(psu.id + " " + psu.name);
      const requiredWattage = getRequiredPSU(gpu.name + " " + gpu.id);
      if (psuWattage < requiredWattage && requiredWattage > 0) {
        issues.push({
          type: "error",
          message: `PSU (${psuWattage}W) insufficient for GPU (needs ${requiredWattage}W)`,
          affectedComponents: ["psu", "gpu"],
        });
      } else if (requiredWattage > 0 && psuWattage < requiredWattage + 100) {
        issues.push({
          type: "warning",
          message: `PSU (${psuWattage}W) has minimal headroom for GPU`,
          affectedComponents: ["psu", "gpu"],
        });
      }
    }

    return issues;
  };

  // Get compatibility status for the preview icons/colors
  const getCompatibilityStatus = (
    partId: string,
    category: string,
    b: BuildState
  ): "compatible" | "warning" | "incompatible" => {
    // Build a temp build with this part chosen for the category
    const tempBuild: BuildState = {
      ...b,
      [category]: [
        {
          id: partId,
          name: getPartName(partId, category) || "",
        },
      ],
    };

    const issues = checkCompatibility(tempBuild);
    const relevant = issues.filter((i) => i.affectedComponents.includes(category));
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
    const compatibility = getCompatibilityStatus(part.id, category, build);

    const getColor = () =>
      compatibility === "compatible"
        ? "bg-gray-800 border-l-green-400"
        : compatibility === "warning"
        ? "bg-yellow-900 border-l-yellow-400"
        : "bg-red-900 border-l-red-400";

    const getIcon = () =>
      compatibility === "compatible" ? "✅" : compatibility === "warning" ? "⚠️" : "❌";

    const [{ isDragging }, drag] = useDrag({
      type: "PART",
      item: { ...part, category },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    return (
      <div
        ref={drag}
        title={tooltipMap[category]}
        className={`p-2 mb-2 border-l-4 border rounded cursor-grab text-white text-sm opacity-${
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

  // ---------------- Compatibility issues for UI ----------------
  const compatibilityIssues = checkCompatibility(build);

  // ---------------- Drop handler ----------------
  const onDropPart = (item: DragItem) => {
    if (build[item.category].length > 0) return;
    setIsRendering(true);
    setTimeout(() => {
      setBuild((prev) => ({ ...prev, [item.category]: [{ id: item.id, name: item.name }] }));
      setIsRendering(false);
      if (step < COMPONENT_ORDER.length - 1) {
        setTimeout(() => setStep((prev) => prev + 1), 500);
      }
    }, 500);
  };

  const handleFinishBuild = () => {
    setShowSummary(true);
  };

  const handleSaveBuild = () => {
    localStorage.setItem("savedBuild", JSON.stringify(build));
    setMessage("✅ Build saved (mock). Backend coming soon!");
    setTimeout(() => setMessage(""), 3000);
  };

  const finishBuild = async () => {
  if (!user) {
    toast.error("Please log in to save your build");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/savedbuilds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // from AuthContext
      },
      body: JSON.stringify({
        name: "My First Build", // optional, can add input later
        parts: {
          case: selectedCase?.id,
          motherboard: selectedMotherboard?.id,
          processor: selectedProcessor?.id,
          gpu: selectedGpu?.id,
          ram: selectedRam?.id,
          storage: selectedStorage?.id,
          psu: selectedPsu?.id,
          cooler: selectedCooler?.id,
        },
      }),
    });

    if (!res.ok) throw new Error("Failed to save build");
    const data = await res.json();
    toast.success("Build saved successfully!");
    console.log("Saved Build:", data);
  } catch (err) {
    toast.error("Error saving build");
    console.error(err);
  }
};

  // render
  if (showSummary) {
    return <SummaryPage build={build} issues={compatibilityIssues} onBack={() => setShowSummary(false)} />;
  }

  // Determine parts to show in the left sidebar for current category
  const partsToRender = getPartsForCategory(currentCategory);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black text-white px-8 py-6 font-mono">
        <div className="text-neonblue text-2xl font-bold mb-4">Pixel Build</div>

        <div className="mb-4 text-sm text-gray-400">
          Step {step + 1} of {COMPONENT_ORDER.length} – Add {capitalize(currentCategory)}
        </div>

        <CompatibilityPanel issues={compatibilityIssues} />

        <div className="flex justify-between gap-4">
          {/* Sidebar */}
          <div className="w-1/5 border border-neonblue p-4 rounded">
            <h2 className="text-neonblue text-md font-semibold mb-2">{currentCategory.toUpperCase()}</h2>
            <div className="mb-3 text-xs text-gray-300">
              <div>✅ Compatible</div>
              <div>⚠️ Warning</div>
              <div>❌ Incompatible</div>
            </div>
            <div className="space-y-2">
              {partsToRender.length === 0 ? (
                <div className="text-gray-500 italic text-sm">Loading...</div>
              ) : (
                partsToRender.map((part, index) => (
                  <DraggablePart key={part.id || index}  part={part} category={currentCategory} build={build} />
                ))
              )}
            </div>

            <div className="flex items-center justify-between mt-4 gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-3 py-1 rounded border border-neonblue text-neonblue hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ◀ Prev
              </button>
              <span className="text-xs text-gray-400">
                {step + 1} / {COMPONENT_ORDER.length}
              </span>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(COMPONENT_ORDER.length - 1, s + 1))}
                disabled={step === COMPONENT_ORDER.length - 1}
                className="px-3 py-1 rounded border border-neonblue text-neonblue hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* Drop Area */}
          <div className="w-3/5 border border-neonblue p-4 rounded space-y-4">
            <DropSlot category={currentCategory} part={build[currentCategory]} build={build} onDropPart={onDropPart} isRendering={isRendering} />

            <div className="flex gap-3 mt-4 justify-center">
          <button
            onClick={async () => {
              const hasParts = Object.values(build).some((parts) => parts.length > 0);
              if (!hasParts) {
                alert("❌ You must add at least one component before finishing.");
                return;
              }

              try {
                const token = localStorage.getItem("token"); // or however you store auth token
                const response = await fetch("http://localhost:5000/api/savedbuilds", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    parts: Object.fromEntries(
                      Object.entries(build).map(([category, parts]) => [
                        category,
                        parts.map((p) => p.id), // only send IDs
                      ])
                    ),
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to save build");
                }

                const savedBuild = await response.json();
                console.log("✅ Build saved:", savedBuild);
                alert("✅ Build saved successfully!");
              } catch (err) {
                console.error("Error saving build:", err);
                alert("❌ Could not save build");
              }
            }}
            className="px-6 py-2 rounded border border-blue-400 text-blue-300 hover:bg-blue-900"
          >
            ✅ Finish Build
          </button>

            </div>
            {message && <div className="mt-2 text-green-400 text-sm">{message}</div>}
          </div>

          {/* Mini Summary Sidebar */}
          <div className="w-1/5 border border-neonblue p-4 rounded text-center">
            <h2 className="font-bold mb-2">Your Build</h2>
            {COMPONENT_ORDER.map((key, index) => (
              <div key={index} className="text-sm">
                {build[key].length > 0 ? `${capitalize(key)}: ${build[key][0].name}` : `${capitalize(key)}: None`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
