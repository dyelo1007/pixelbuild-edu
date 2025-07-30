import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "@/index.css";

const COMPONENTS = {
  case: [
    { id: "case-nzxt", name: "NZXT H510" },
    { id: "case-lianli", name: "Lian Li O11 Dynamic" },
  ],
  motherboard: [
    { id: "motherboard-msi", name: "MSI B550 Tomahawk" },
    { id: "motherboard-asus", name: "ASUS Z690-A" },
  ],
  processor: [
    { id: "processor-amd", name: "AMD Ryzen 9 3900x" },
    { id: "processor-intel", name: "Intel i9-12900K" },
  ],
  gpu: [
    { id: "gpu-nvidia", name: "NVIDIA RTX 3080" },
    { id: "gpu-amd", name: "AMD Radeon RX 6800 XT" },
  ],
  ram: [
    { id: "ram-corsair", name: "Corsair Vengeance 16GB" },
    { id: "ram-gskill", name: "G.Skill Trident Z 16GB" },
  ],
  storage: [
    { id: "storage-samsung", name: "Samsung 970 EVO 1TB" },
    { id: "storage-wd", name: "WD Blue 1TB HDD" },
  ],
  psu: [
    { id: "psu-evga", name: "EVGA 650W Bronze" },
    { id: "psu-corsair", name: "Corsair RM750x" },
  ],
  cooler: [
    { id: "cooler-nzxt", name: "NZXT Kraken X63" },
    { id: "cooler-noctua", name: "Noctua NH-D15" },
  ],
};

const COMPONENT_ORDER = Object.keys(COMPONENTS);

const SINGLE_SLOT_CATEGORIES = COMPONENT_ORDER;

const getCategoryFromId = (id) => id.split("-")[0];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const tooltipMap = {
  case: "Holds all components together and ensures airflow.",
  motherboard: "Connects all components and distributes power.",
  processor: "Brain of your PC that handles calculations.",
  gpu: "Handles rendering for games and graphic tasks.",
  ram: "Temporary memory used for fast data access.",
  storage: "Stores your OS, games, and files.",
  psu: "Powers all components in your system.",
  cooler: "Keeps your CPU from overheating.",
};

const DraggablePart = ({ part }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "part",
    item: { ...part, category: getCategoryFromId(part.id) },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const category = getCategoryFromId(part.id);
  const tooltip = tooltipMap[category] || "Component";

  return (
    <div
      ref={drag}
      title={tooltip}
      className={`p-2 mb-2 border rounded cursor-pointer bg-gray-800 text-white text-sm hover:bg-gray-700 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {part.name}
    </div>
  );
};

const DropZone = ({ onDrop, droppedParts, category }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "part",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const part = droppedParts[0];

  return (
    <div
      ref={drop}
      className={`w-full h-64 border-dashed border-2 border-white p-4 flex flex-col justify-center items-center text-center text-sm overflow-auto transition-colors duration-300 ${
        isOver ? "bg-neonblue bg-opacity-10" : ""
      }`}
    >
      {part ? (
        <>
          <div className="w-32 h-32 bg-gray-700 rounded mb-2 flex items-center justify-center text-white text-xs">
            [Image Placeholder]
          </div>
          <span className="text-white text-sm font-bold mb-1">
            ✅ You added: {part.name}
          </span>
          <span className="text-xs text-gray-400 italic">
            Only one {category} can be added.
          </span>
        </>
      ) : (
        <span className="italic text-gray-400">{`< Drop your ${category} here >`}</span>
      )}
    </div>
  );
};

const YourBuild = ({ build }) => (
  <div className="text-neonblue space-y-2">
    <h2 className="font-bold text-center mb-2">Your Build</h2>
    <div className="text-sm space-y-1">
      {COMPONENT_ORDER.map((key) => (
        <div key={key}>
          {build[key].length > 0
            ? `${capitalize(key)}: ${build[key].map((p) => p.name).join(", ")}`
            : `${capitalize(key)}: None`}
        </div>
      ))}
    </div>
  </div>
);

const isCompatible = (part, build, currentCategory) => {
  const motherboard = build["motherboard"][0];
  const processor = build["processor"][0];

  if (currentCategory === "processor" && motherboard) {
    if (
      (part.id.includes("intel") && motherboard.id.includes("b550")) ||
      (part.id.includes("amd") && motherboard.id.includes("z690"))
    ) {
      return {
        compatible: false,
        reason: "❌ Incompatible CPU and motherboard brands.",
      };
    }
  }

  if (currentCategory === "motherboard" && processor) {
    if (
      (processor.id.includes("intel") && part.id.includes("b550")) ||
      (processor.id.includes("amd") && part.id.includes("z690"))
    ) {
      return {
        compatible: false,
        reason: "❌ Incompatible motherboard and CPU brands.",
      };
    }
  }

  return { compatible: true };
};

export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [build, setBuild] = useState(
    COMPONENT_ORDER.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
  );
  const currentCategory = COMPONENT_ORDER[step];

  const handleDrop = (part) => {
    if (part.category !== currentCategory) {
      alert(`Please drop a valid ${currentCategory} component.`);
      return;
    }

    if (
      SINGLE_SLOT_CATEGORIES.includes(currentCategory) &&
      build[currentCategory].length >= 1
    ) {
      alert(`Only one ${currentCategory} can be added.`);
      return;
    }

    const { compatible, reason } = isCompatible(part, build, currentCategory);
    if (!compatible) {
      alert(reason);
      return;
    }

    const alreadyExists = build[currentCategory].some((p) => p.id === part.id);
    if (alreadyExists) return;

    setBuild((prev) => ({
      ...prev,
      [currentCategory]: [...prev[currentCategory], part],
    }));
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step < COMPONENT_ORDER.length - 1) setStep((prev) => prev + 1);
  };

  const simulateBoot = () => {
    const required = [
      "case",
      "motherboard",
      "processor",
      "gpu",
      "ram",
      "storage",
      "psu",
    ];
    const missing = required.filter((key) => build[key].length === 0);

    if (missing.length > 0) {
      alert(`❌ System failed to boot. Missing: ${missing.join(", ")}`);
      return;
    }

    const { compatible, reason } = isCompatible(
      build.processor[0],
      build,
      "processor"
    );
    if (!compatible) {
      alert(`❌ System failed to boot. ${reason}`);
      return;
    }

    alert("✅ System boot successful! All checks passed.");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black text-white px-8 py-6 font-mono">
        <div className="text-neonblue text-2xl font-bold mb-6">Pixel Build</div>

        <div key={step} className="flex justify-between gap-4">
          {/* Sidebar */}
          <div className="w-1/5 border border-neonblue p-4 rounded">
            <h2 className="text-neonblue text-md font-semibold mb-2">
              {currentCategory.toUpperCase()}
            </h2>
            <div className="space-y-2">
              {COMPONENTS[currentCategory].map((part) => (
                <DraggablePart key={part.id} part={part} />
              ))}
            </div>
            <button
              onClick={handleBack}
              className={`mt-4 text-xs underline ${
                step === 0 ? "text-gray-500" : "text-neonblue"
              }`}
              disabled={step === 0}
            >
              ← Back
            </button>
          </div>

          {/* Drop Area */}
          <div className="w-3/5 border border-neonblue p-4 rounded">
            <DropZone
              onDrop={handleDrop}
              droppedParts={build[currentCategory]}
              category={currentCategory}
            />
            {/* Compatibility tips */}
            {(currentCategory === "processor" ||
              currentCategory === "motherboard") &&
              build.processor.length === 1 &&
              build.motherboard.length === 0 && (
                <div className="mt-2 text-xs text-yellow-400 italic">
                  💡 Tip: Choose a motherboard that matches{" "}
                  {build.processor[0].name.includes("Intel") ? "Intel" : "AMD"}.
                </div>
              )}
            {(currentCategory === "motherboard" ||
              currentCategory === "processor") &&
              build.motherboard.length === 1 &&
              build.processor.length === 0 && (
                <div className="mt-2 text-xs text-yellow-400 italic">
                  💡 Tip: Choose a CPU that works with{" "}
                  {build.motherboard[0].name.includes("MSI") ? "AMD" : "Intel"}.
                </div>
              )}

            <button
              onClick={handleNext}
              className={`mt-4 px-4 py-1 rounded text-sm ${
                build[currentCategory].length === 0
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-neonblue text-black"
              }`}
              disabled={
                build[currentCategory].length === 0 ||
                step === COMPONENT_ORDER.length - 1
              }
            >
              Proceed →
            </button>
          </div>

          {/* Your Build */}
          <div className="w-1/5 border border-neonblue p-4 rounded text-center">
            <YourBuild build={build} />
            <button
              onClick={simulateBoot}
              className="mt-4 px-3 py-1 rounded text-sm bg-green-500 text-black hover:bg-green-400"
            >
              🧪 Simulate Boot
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
