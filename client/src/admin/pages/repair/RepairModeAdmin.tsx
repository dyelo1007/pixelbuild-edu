{
  /**-------------------TEST CODE------------------ */
}

import React, { useState } from "react";

// Dummy example data (replace with backend data later)
const initialScenarios = [
  {
    id: 1,
    title: "PC Won't Boot",
    description: "The PC powers on but no display is shown.",
    components: { CPU: "Intel i5", RAM: "8GB", GPU: "GTX 1060" },
    replacementParts: ["Intel i7", "16GB RAM", "GTX 1660"],
    correctPart: { slot: "RAM", value: "16GB RAM" },
    explanation: "The RAM was insufficient, upgrading fixes the issue.",
  },
];

const RepairAdmin: React.FC = () => {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [selectedScenario, setSelectedScenario] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleChange = (field: string, value: any) => {
    setSelectedScenario((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save scenario (create or update)
  const handleSave = () => {
    if (selectedScenario.id) {
      // update
      setScenarios((prev) =>
        prev.map((s) => (s.id === selectedScenario.id ? selectedScenario : s))
      );
    } else {
      // new scenario
      setScenarios((prev) => [
        ...prev,
        { ...selectedScenario, id: Date.now() },
      ]);
    }
    setSelectedScenario(null);
    setIsEditing(false);
  };

  // Delete scenario
  const handleDelete = (id: number) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    setSelectedScenario(null);
  };

  return (
    <div className="min-h-screen bg-darkbg text-white p-6">
      <h1 className="text-2xl font-bold text-neonblue mb-6">
        🛠 Repair Mode Admin Panel
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Scenario List */}
        <div className="w-full lg:w-1/3 bg-darkblue rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Scenarios</h2>
          <button
            onClick={() => {
              setSelectedScenario({
                id: null,
                title: "",
                description: "",
                components: {},
                replacementParts: [],
                correctPart: { slot: "", value: "" },
                explanation: "",
              });
              setIsEditing(true);
            }}
            className="w-full mb-4 bg-neonblue text-black font-semibold px-4 py-2 rounded-lg hover:bg-hoverprimary transition"
          >
            ➕ Add New Scenario
          </button>
          <ul className="space-y-2">
            {scenarios.map((s) => (
              <li
                key={s.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedScenario?.id === s.id
                    ? "bg-neonblue text-black"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedScenario(s);
                  setIsEditing(false);
                }}
              >
                {s.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel - Details / Editor */}
        <div className="flex-1 bg-darkblue rounded-xl p-6 shadow-lg">
          {!selectedScenario && (
            <p className="text-gray-400">Select a scenario to view/edit</p>
          )}

          {selectedScenario && !isEditing && (
            <div>
              <h2 className="text-xl font-bold mb-2">
                {selectedScenario.title}
              </h2>
              <p className="text-gray-300 mb-4">
                {selectedScenario.description}
              </p>

              <h3 className="font-semibold mb-1">Components:</h3>
              <ul className="text-sm text-gray-400 mb-4">
                {Object.entries(selectedScenario.components).map(
                  ([slot, value]) => (
                    <li key={slot}>
                      <span className="font-bold">{slot}:</span> {value}
                    </li>
                  )
                )}
              </ul>

              <h3 className="font-semibold mb-1">Replacement Parts:</h3>
              <ul className="text-sm text-gray-400 mb-4">
                {selectedScenario.replacementParts.map(
                  (p: string, i: number) => (
                    <li key={i}>{p}</li>
                  )
                )}
              </ul>

              <h3 className="font-semibold mb-1">Correct Part:</h3>
              <p className="text-sm text-gray-400 mb-4">
                {selectedScenario.correctPart.slot} →{" "}
                {selectedScenario.correctPart.value}
              </p>

              <h3 className="font-semibold mb-1">Explanation:</h3>
              <p className="text-sm text-gray-400 mb-4">
                {selectedScenario.explanation}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-neonblue text-black font-semibold rounded-lg hover:bg-hoverprimary transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedScenario.id)}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {selectedScenario && isEditing && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={selectedScenario.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-2 rounded-lg text-black"
              />
              <textarea
                placeholder="Description"
                value={selectedScenario.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full p-2 rounded-lg text-black"
              />

              <textarea
                placeholder="Components (JSON)"
                value={JSON.stringify(selectedScenario.components, null, 2)}
                onChange={(e) =>
                  handleChange("components", JSON.parse(e.target.value || "{}"))
                }
                className="w-full p-2 rounded-lg text-black font-mono text-sm"
              />

              <textarea
                placeholder="Replacement Parts (comma separated)"
                value={selectedScenario.replacementParts.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "replacementParts",
                    e.target.value.split(",").map((p) => p.trim())
                  )
                }
                className="w-full p-2 rounded-lg text-black font-mono text-sm"
              />

              <input
                type="text"
                placeholder="Correct Part Slot"
                value={selectedScenario.correctPart.slot}
                onChange={(e) =>
                  handleChange("correctPart", {
                    ...selectedScenario.correctPart,
                    slot: e.target.value,
                  })
                }
                className="w-full p-2 rounded-lg text-black"
              />

              <input
                type="text"
                placeholder="Correct Part Value"
                value={selectedScenario.correctPart.value}
                onChange={(e) =>
                  handleChange("correctPart", {
                    ...selectedScenario.correctPart,
                    value: e.target.value,
                  })
                }
                className="w-full p-2 rounded-lg text-black"
              />

              <textarea
                placeholder="Explanation"
                value={selectedScenario.explanation}
                onChange={(e) => handleChange("explanation", e.target.value)}
                className="w-full p-2 rounded-lg text-black"
              />

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Save Scenario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairAdmin;
