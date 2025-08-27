import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const DropdownGroup = ({ label, items, selected, setSelected }) => {
  const [open, setOpen] = useState(label === "Processor (CPU)");

  const toggle = () => {
    setOpen(!open);
    setSelected(label);
  };

  // Check if a sub-item is selected (selected string includes this group label and ">")
  const isGroupSelected =
    selected === label || selected.startsWith(`${label} >`);

  return (
    <div className="mb-4">
      <div
        className={`w-full px-3 py-2 rounded cursor-pointer transition-colors duration-150 ${
          selected === label ? "bg-[#2e2e2e] font-bold" : "hover:bg-[#333]"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Label: triggers setSelected */}
          <span onClick={() => setSelected(label)} className="flex-1">
            {label}
          </span>

          {/* Chevron: toggles dropdown */}
          {items.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent label click
                toggle();
              }}
              className="ml-2"
            >
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Items */}
      {open && items.length > 0 && (
        <div className="relative ml-6 mt-2 pl-4 border-l-2 border-[#444] space-y-2">
          {items.map((item: string, index: number) => {
            const fullPath = `${label} > ${item}`;
            const isSelected = selected === fullPath;

            return (
              <div
                key={index}
                className={`text-sm cursor-pointer px-2 py-1 rounded-md transition-all duration-150 ${
                  isSelected
                    ? "bg-[#383838] text-white font-semibold border-l-4 border-neonblue"
                    : "text-gray-300 hover:text-white hover:bg-[#2f2f2f]"
                }`}
                onClick={() => setSelected(fullPath)}
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
