import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { repairScenarios } from "./RepairData";
import DroppableSlot from "./DroppableSlot";
import DraggablePart from "./DraggablePart";

const RepairMode: React.FC = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  const initial = JSON.parse(JSON.stringify(repairScenarios[0].components));
  const [currentComponents, setCurrentComponents] =
    useState<Record<string, string>>(initial);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const scenario = repairScenarios[currentScenarioIndex];

  const handlePartSwap = (slot: string, part: string) => {
    setCurrentComponents((prev) => ({
      ...prev,
      [slot]: part,
    }));
  };

  const handleCheckFix = () => {
    const { slot, value } = scenario.correctPart;
    if (currentComponents[slot] === value) {
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const handleNextScenario = () => {
    const nextIndex = (currentScenarioIndex + 1) % repairScenarios.length;
    setCurrentScenarioIndex(nextIndex);

    const nextComponents = JSON.parse(
      JSON.stringify(repairScenarios[nextIndex].components)
    );
    setCurrentComponents(nextComponents);

    setFeedback(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen p-6 text-gray-900  dark:text-white transition-colors">
        {/* Wrong Answer Banner */}
        {feedback === "wrong" && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[60%] bg-red-600 text-white text-center py-2 rounded-lg shadow-lg z-100">
            ❌ Wrong answer! Try again.
          </div>
        )}

        {/* Correct Overlay */}
        {feedback === "correct" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-60 z-40 p-4">
            <div className="bg-lightbg dark:bg-darkgray p-6 rounded-2xl shadow-lg text-center max-w-lg w-full">
              <h2 className="text-2xl font-bold text-rightgreen mb-2">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-700 dark:text-white mb-4">
                {scenario.explanation}
              </p>
              <button
                onClick={handleNextScenario}
                className="px-4 py-2 bg-neonblue text-black font-semibold rounded-lg hover:bg-hoverprimary transition"
              >
                Next Scenario
              </button>
            </div>
          </div>
        )}

        {/* Repair Mode Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Component slots */}
          <div className="flex-1 bg-[#bde4d7] dark:bg-darkgray p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-neonblue mb-4">
              Repair Mode
            </h1>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {scenario.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {scenario.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(currentComponents).map(([slot, value]) => (
                <DroppableSlot
                  key={slot}
                  slot={slot}
                  value={value}
                  onDropPart={(part) => handlePartSwap(slot, part)}
                />
              ))}
            </div>
          </div>

          {/* Right: Replacement Parts */}
          <div className="w-full lg:w-80 bg-[#bde4d7] dark:bg-darkgray p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-bold text-neonblue mb-4">
              Replacement Parts
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {scenario.replacementParts.map((part, i) => (
                <div key={i} className="w-full sm:w-auto">
                  <DraggablePart part={part} />
                </div>
              ))}
            </div>

            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
              Repair Tips
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 text-sm mb-6">
              <li>Drag and drop replacement parts into the correct slots.</li>
              <li>After swapping, press Check Fix to validate.</li>
            </ul>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCheckFix}
                className="px-4 py-2 font-semibold rounded-lg transition bg-neonblue text-black hover:bg-hoverprimary"
              >
                Check Fix
              </button>
              <button
                onClick={handleNextScenario}
                className="px-4 py-2 bg-darkblue text-white font-semibold rounded-lg hover:bg-hoverprimary transition"
              >
                Skip Scenario
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default RepairMode;
