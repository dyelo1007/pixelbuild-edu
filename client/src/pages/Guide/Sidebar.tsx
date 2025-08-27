import DropdownGroup from "./DropdownGroup";

{
  /** Add names. Dagdagan nalang din objects pag kulang */
}
const components = [
  {
    label: "Processor (CPU)",
    items: [
      "Dropdown Placeholder 1",
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

const Sidebar = ({ selected, setSelected }) => {
  return (
    <div className="w-full lg:w-80 p-4 outline-neonblue outline-2 bg-darkbg rounded-2xl">
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
