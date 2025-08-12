import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Part = {
  id: string;
  name: string;
};

type BuildState = Record<string, Part[]>;

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

const COMPONENT_ORDER = Object.keys(COMPONENTS);
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

type DragItem = Part & { category: string };

const DraggablePart: React.FC<{ part: Part; category: string }> = ({
  part,
  category,
}) => {
  const [, drag] = useDrag(() => ({
    type: "PART",
    item: { ...part, category },
  }));
  return (
    <div
      ref={drag}
      title={tooltipMap[category]}
      className="p-2 mb-2 border rounded cursor-grab bg-gray-800 text-white text-sm hover:bg-gray-700"
    >
      {part.name}
    </div>
  );
};

// --- imports and type definitions unchanged ---

const DropSlot: React.FC<{
  category: string;
  part: Part[];
  build: BuildState; // added
  onDropPart: (item: DragItem) => void;
  isRendering: boolean;
}> = ({ category, part, build, onDropPart, isRendering }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PART",
    drop: (item: DragItem) => onDropPart(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // NEW: Create a combined list of all added components
  const allComponents = Object.values(build)
    .flat()
    .filter(Boolean)
    .map((c) => c.name)
    .join(" + ");

  return (
    <div
      ref={drop}
      className={`w-full h-64 border-dashed border-2 p-4 flex flex-col justify-center items-center text-center text-sm ${
        isOver ? "border-neonblue" : "border-white"
      }`}
    >
      <div className="w-32 h-32 bg-gray-700 rounded mb-2 flex items-center justify-center text-white text-xs">
        [Image Placeholder]
      </div>

      {/* CHANGED: Show all components instead of just current part */}
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

export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [build, setBuild] = useState<BuildState>(
    COMPONENT_ORDER.reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as BuildState
    )
  );

  const currentCategory = COMPONENT_ORDER[step];

  const onDropPart = (item: DragItem) => {
    if (build[item.category].length > 0) return;
    setIsRendering(true);
    setTimeout(() => {
      setBuild((prev) => ({
        ...prev,
        [item.category]: [item],
      }));
      setIsRendering(false);
      if (step < COMPONENT_ORDER.length - 1) {
        setTimeout(() => setStep((prev) => prev + 1), 500);
      }
    }, 800);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black text-white px-8 py-6 font-mono">
        <div className="text-neonblue text-2xl font-bold mb-4">Pixel Build</div>

        <div className="mb-4 text-sm text-gray-400">
          Step {step + 1} of {COMPONENT_ORDER.length} – Add{" "}
          {capitalize(currentCategory)}
        </div>

        <div className="flex justify-between gap-4">
          {/* Sidebar */}
          <div className="w-1/5 border border-neonblue p-4 rounded">
            <h2 className="text-neonblue text-md font-semibold mb-2">
              {currentCategory.toUpperCase()}
            </h2>
            <div className="space-y-2">
              {COMPONENTS[currentCategory].map((part) => (
                <DraggablePart
                  key={part.id}
                  part={part}
                  category={currentCategory}
                />
              ))}
            </div>
          </div>

          {/* Drop Area */}
          <div className="w-3/5 border border-neonblue p-4 rounded space-y-4">
            <DropSlot
              category={currentCategory}
              part={build[currentCategory]}
              build={build} // pass full build
              onDropPart={onDropPart}
              isRendering={isRendering}
            />
          </div>

          {/* Build Summary */}
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
