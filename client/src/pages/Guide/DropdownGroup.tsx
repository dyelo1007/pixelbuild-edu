import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const DropdownGroup = ({ label, items, selected, setSelected }) => {
  const [open, setOpen] = useState(label === "Processor (CPU)");

  const toggle = () => {
    setOpen(!open);
    setSelected(label);
  };

  const isGroupSelected =
    selected === label || selected.startsWith(`${label} >`);

  return (
    <div className="mb-4">
      {/* Group Header */}
      <div
        className={`w-full px-3 py-2 rounded cursor-pointer transition-colors duration-150 
          ${
            selected === label
              ? "bg-lightbgfill dark:bg-darkblue text-white font-bold"
              : "hover:bg-hoverprimary/20 dark:hover:bg-darkgray"
          }`}
      >
        <div className="flex justify-between items-center">
          {/* Label */}
          <span
            onClick={() => setSelected(label)}
            className="flex-1 text-gray-900 dark:text-white"
          >
            {label}
          </span>

          {/* dropdown icon */}
          {items.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              className="ml-2 text-gray-500 dark:text-gray-300 hover:text-neonblue transition"
            >
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Items */}
      {open && items.length > 0 && (
        <div className="relative ml-6 mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-2">
          {items.map((item: string, index: number) => {
            const fullPath = `${label} > ${item}`;
            const isSelected = selected === fullPath;

            return (
              <div
                key={index}
                onClick={() => setSelected(fullPath)}
                className={`text-sm cursor-pointer px-2 py-1 rounded-md transition-all duration-150
                  ${
                    isSelected
                      ? "bg-hoverprimary/30 text-cyan-900 dark:text-neonblue font-semibold border-l-4 border-neonblue"
                      : "text-gray-700 dark:text-gray-300 hover:text-neonblue hover:bg-hoverprimary/10"
                  }`}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownGroup;
