import React, { useState } from "react";
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
const COMPONENTS: Record<string, Part[]> = {
  case: [
    { id: "case-atx-nzxt", name: "NZXT H510 (ATX)" },
    { id: "case-matx-cooler", name: "Cooler Master Q300L (mATX)" },
    { id: "case-itx-nzxt", name: "NZXT H1 (ITX)" },
  ],
  motherboard: [
    { id: "mb-atx-x870", name: "X870 (ATX, DDR5, up to 8200)" },
    { id: "mb-atx-x670", name: "X670 (ATX, DDR5, up to 8200)" },
    { id: "mb-matx-b650", name: "B650 (mATX, DDR5, up to 7600)" },
    { id: "mb-atx-b850", name: "B850 (ATX, DDR5, up to 8200)" },
    { id: "mb-itx-b650", name: "B650 (ITX, DDR5, up to 7600)" },
  ],
  processor: [
    { id: "cpu-r5-7600", name: "Ryzen 5 7600 (DDR5-5200)" },
    { id: "cpu-r5-7500f", name: "Ryzen 5 7500F (DDR5-5200)" },
    { id: "cpu-r5-8400f", name: "Ryzen 5 8400F (DDR5-5600)" },
    { id: "cpu-r7-7700", name: "Ryzen 7 7700 (DDR5-5200)" },
    { id: "cpu-r7-7800x3d", name: "Ryzen 7 7800X3D (DDR5-5200)" },
    { id: "cpu-r7-9700x", name: "Ryzen 7 9700X (DDR5-5600)" },
    { id: "cpu-r9-7900", name: "Ryzen 9 7900 (DDR5-5200)" },
    { id: "cpu-r9-7950x", name: "Ryzen 9 7950X (DDR5-5200)" },
    { id: "cpu-r9-9900x", name: "Ryzen 9 9900X (DDR5-5600)" },
  ],
  gpu: [
    { id: "gpu-rtx3060", name: "RTX 3060 (600W PSU)" },
    { id: "gpu-rtx3080", name: "RTX 3080 (850W PSU)" },
    { id: "gpu-rtx4090", name: "RTX 4090 (950W PSU)" },
    { id: "gpu-rx6700xt", name: "RX 6700 XT (600W PSU)" },
    { id: "gpu-rx7900xtx", name: "RX 7900 XTX (950W PSU)" },
  ],
  ram: [
    { id: "ram-ddr5-5200", name: "DDR5-5200 16GB" },
    { id: "ram-ddr5-5600", name: "DDR5-5600 16GB" },
    { id: "ram-ddr5-7600", name: "DDR5-7600 16GB" },
    { id: "ram-ddr5-8200", name: "DDR5-8200 16GB" },
  ],
  storage: [
    { id: "storage-samsung", name: "Samsung 980 PRO 1TB NVMe" },
    { id: "storage-wd", name: "WD Black SN850X 1TB NVMe" },
  ],
  psu: [
    { id: "psu-650w", name: "650W Gold" },
    { id: "psu-850w", name: "850W Gold" },
    { id: "psu-1000w", name: "1000W Platinum" },
  ],
  cooler: [
    { id: "cooler-nzxt", name: "NZXT Kraken X63" },
    { id: "cooler-noctua", name: "Noctua NH-D15" },
  ],
};

// ---------------- COMPATIBILITY HELPERS ----------------
const getFormFactor = (id: string): string => {
  if (id.includes("atx") && !id.includes("matx")) return "ATX";
  if (id.includes("matx")) return "mATX";
  if (id.includes("itx")) return "ITX";
  return "unknown";
};

const getDDRType = (id: string): string => {
  if (id.includes("ddr5")) return "DDR5";
  return "unknown";
};

const getDDRSpeed = (id: string): number => {
  const match = id.match(/(\d{4,5})/);
  return match ? parseInt(match[1]) : 0;
};

const getPSUWattage = (id: string): number => {
  const match = id.match(/(\d+)w/i);
  return match ? parseInt(match[1]) : 0;
};

const getRequiredPSU = (id: string): number => {
  const match = id.match(/(\d+)W PSU/);
  return match ? parseInt(match[1]) : 0;
};

const checkCompatibility = (build: BuildState): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];

  const case_ = build.case[0];
  const motherboard = build.motherboard[0];
  const cpu = build.processor[0];
  const gpu = build.gpu[0];
  const ram = build.ram[0];
  const psu = build.psu[0];

  if (case_ && motherboard) {
    const caseFormFactor = getFormFactor(case_.id);
    const mbFormFactor = getFormFactor(motherboard.id);
    const hierarchy = { ATX: 3, mATX: 2, ITX: 1 };
    if (hierarchy[caseFormFactor] < hierarchy[mbFormFactor]) {
      issues.push({
        type: "error",
        message: `${mbFormFactor} motherboard won't fit in ${caseFormFactor} case`,
        affectedComponents: ["case", "motherboard"],
      });
    }
  }

  if (cpu && motherboard) {
    const cpuDDR = getDDRType(cpu.name);
    const mbDDR = getDDRType(motherboard.name);
    if (cpuDDR !== mbDDR && cpuDDR !== "unknown" && mbDDR !== "unknown") {
      issues.push({
        type: "error",
        message: `CPU supports ${cpuDDR} but motherboard supports ${mbDDR}`,
        affectedComponents: ["processor", "motherboard"],
      });
    }
  }

  if (ram && motherboard) {
    const ramSpeed = getDDRSpeed(ram.id);
    const mbMaxSpeed = getDDRSpeed(motherboard.name);
    if (ramSpeed > mbMaxSpeed) {
      issues.push({
        type: "warning",
        message: `RAM speed (${ramSpeed}) exceeds motherboard max (${mbMaxSpeed})`,
        affectedComponents: ["ram", "motherboard"],
      });
    }
  }

  if (cpu && ram) {
    const cpuMaxSpeed = getDDRSpeed(cpu.name);
    const ramSpeed = getDDRSpeed(ram.id);
    if (ramSpeed > cpuMaxSpeed) {
      issues.push({
        type: "warning",
        message: `RAM speed (${ramSpeed}) exceeds CPU spec (${cpuMaxSpeed})`,
        affectedComponents: ["processor", "ram"],
      });
    }
  }

  if (psu && gpu) {
    const psuWattage = getPSUWattage(psu.id);
    const requiredWattage = getRequiredPSU(gpu.name);
    if (psuWattage < requiredWattage) {
      issues.push({
        type: "error",
        message: `PSU (${psuWattage}W) insufficient for GPU (needs ${requiredWattage}W)`,
        affectedComponents: ["psu", "gpu"],
      });
    } else if (psuWattage < requiredWattage + 100) {
      issues.push({
        type: "warning",
        message: `PSU (${psuWattage}W) has minimal headroom for GPU`,
        affectedComponents: ["psu", "gpu"],
      });
    }
  }

  return issues;
};

const getCompatibilityStatus = (
  partId: string,
  category: string,
  build: BuildState
): "compatible" | "warning" | "incompatible" => {
  const tempBuild = {
    ...build,
    [category]: [
      {
        id: partId,
        name: COMPONENTS[category].find((p) => p.id === partId)?.name || "",
      },
    ],
  };
  const issues = checkCompatibility(tempBuild);
  const relevant = issues.filter((i) =>
    i.affectedComponents.includes(category)
  );
  if (relevant.some((i) => i.type === "error")) return "incompatible";
  if (relevant.some((i) => i.type === "warning")) return "warning";
  return "compatible";
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

// ---------------- COMPATIBILITY PANEL ----------------
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

// ---------------- SUMMARY PAGE ----------------
const SummaryPage: React.FC<{
  build: BuildState;
  issues: CompatibilityIssue[];
  onBack: () => void;
}> = ({ build, issues, onBack }) => {
  const handleSaveBuild = () => {
    const hasParts = Object.values(build).some((parts) => parts.length > 0);
    if (!hasParts) {
      alert("❌ You cannot save an empty build.");
      return;
    }
    localStorage.setItem("savedBuild", JSON.stringify(build));
    alert("✅ Build saved (joke si kyle na bahala)");
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      <h1 className="text-2xl font-bold text-neonblue mb-4">
        📋 Build Summary
      </h1>

      {/* Build List */}
      {Object.entries(build).map(([category, parts]) => (
        <div
          key={category}
          className="mb-3 p-3 border border-neonblue rounded bg-gray-900"
        >
          <h2 className="text-neonblue text-lg font-semibold mb-2">
            {category.toUpperCase()}
          </h2>
          {parts.length > 0 ? (
            <p className="text-green-400">✅ {parts[0].name}</p>
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
                    ? "bg-yellow-900 border-yellow-400 text-yellow-300"
                    : "bg-blue-900 border-blue-400 text-blue-300"
                }`}
              >
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
      <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
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
        <button
          onClick={onBack}
          className="px-4 py-2 rounded border border-gray-500 hover:bg-gray-700"
        >
          ◀ Back to Build
        </button>
        <button
          onClick={handleSaveBuild}
          className="px-4 py-2 rounded border border-neonblue text-neonblue hover:bg-green-900"
        >
          💾 Save Build
        </button>

        <button
          onClick={() => (window.location.href = "/guides")}
          className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          📘 Guides
        </button>
      </div>
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
  const [showSummary, setShowSummary] = useState(false);
  const [message, setMessage] = useState("");

  const currentCategory = COMPONENT_ORDER[step];
  const compatibilityIssues = checkCompatibility(build);

  // ✅ if user clicked "Finish Build", show the summary page
  if (showSummary) {
    return (
      <SummaryPage
        build={build}
        issues={compatibilityIssues}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  const onDropPart = (item: DragItem) => {
    if (build[item.category].length > 0) return;
    setIsRendering(true);
    setTimeout(() => {
      setBuild((prev) => ({ ...prev, [item.category]: [item] }));
      setIsRendering(false);
      if (step < COMPONENT_ORDER.length - 1) {
        setTimeout(() => setStep((prev) => prev + 1), 500);
      }
    }, 800);
  };

  const handleFinishBuild = () => {
    setShowSummary(true);
  };

  const handleSaveBuild = () => {
    localStorage.setItem("savedBuild", JSON.stringify(build));
    setMessage("✅ Build saved (mock). Backend coming soon!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black text-white px-8 py-6">
        <div className="text-neonblue text-2xl font-bold mb-4">Pixel Build</div>

        {/* Build Steps */}
        <div className="mb-4 text-sm text-gray-400">
          Step {step + 1} of {COMPONENT_ORDER.length} – Add{" "}
          {capitalize(currentCategory)}
        </div>

        <CompatibilityPanel issues={compatibilityIssues} />

        <div className="flex justify-between gap-4">
          {/* Sidebar */}
          <div className="w-1/5 border border-neonblue p-4 rounded">
            <h2 className="text-neonblue text-md font-semibold mb-2">
              {currentCategory.toUpperCase()}
            </h2>
            <div className="mb-3 text-xs text-gray-300">
              <div>✅ Compatible</div>
              <div>⚠️ Warning</div>
              <div>❌ Incompatible</div>
            </div>
            <div className="space-y-2">
              {COMPONENTS[currentCategory].map((part) => (
                <DraggablePart
                  key={part.id}
                  part={part}
                  category={currentCategory}
                  build={build}
                />
              ))}
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
                onClick={() =>
                  setStep((s) => Math.min(COMPONENT_ORDER.length - 1, s + 1))
                }
                disabled={step === COMPONENT_ORDER.length - 1}
                className="px-3 py-1 rounded border border-neonblue text-neonblue hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
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

            {/* Action buttons under drop area */}
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
                className="px-6 py-2 rounded border border-blue-400 text-blue-300 hover:bg-blue-900"
              >
                ✅ Finish Build
              </button>
            </div>
            {message && (
              <div className="mt-2 text-green-400 text-sm">{message}</div>
            )}
          </div>

          {/* Mini Summary Sidebar */}
          <div className="w-1/5 border border-neonblue p-4 rounded text-center">
            <h2 className="font-bold mb-2">Your Build</h2>
            {COMPONENT_ORDER.map((key) => (
              <div key={key} className="text-sm">
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
