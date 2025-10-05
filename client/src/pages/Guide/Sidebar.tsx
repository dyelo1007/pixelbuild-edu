import React from "react";
import DropdownGroup from "./DropdownGroup";

{
  /** Add names. Dagdagan nalang din objects pag kulang */
}

const components = [
  {
    label: "Processor (CPU)",
    items: [
      "CPU Tiers & Generations",
      "Dropdown Placeholder 2",
      "Dropdown Placeholder 3",
    ],
  },
  {
    label: "Motherboard",
    items: [
      "Dropdown Placeholder 1",
      "Dropdown Placeholder 2",
      "Dropdown Placeholder 3",
    ],
  },
  {
    label: "GPU",
    items: [
      "Dropdown Placeholder 1",
      "Dropdown Placeholder 2",
      "Dropdown Placeholder 3",
    ],
  },
  {
    label: "RAM",
    items: [
      "Dropdown Placeholder 1",
      "Dropdown Placeholder 2",
      "Dropdown Placeholder 3",
    ],
  },
  {
    label: "PSU",
    items: [
      "Dropdown Placeholder 1",
      "Dropdown Placeholder 2",
      "Dropdown Placeholder 3",
    ],
  },
  {
    label: "Case",
    items: [
      "Dropdown Placeholder 1",
      "Dropdown Placeholder 2",
      "Dropdown Placeholder 3",
    ],
  },
];

// ✅ Define prop types
type SidebarProps = {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar: React.FC<SidebarProps> = ({ selected, setSelected }) => {
  return (
    <div className="w-full lg:w-80 p-4 outline-neonblue outline-2 rounded-2xl bg-lightbg dark:bg-darkbg">
      <h2 className="text-neonblue text-xl mb-6 font-bold mt-2 ml-2">
        Components
      </h2>
      <div className="space-y-4 text-neonblue font-bold">
        {components.map((group) => (
          <DropdownGroup
            key={group.label}
            label={group.label}
            items={group.items}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
