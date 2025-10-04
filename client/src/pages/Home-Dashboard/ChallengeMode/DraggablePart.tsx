import { useRef } from "react";
import { useDrag } from "react-dnd";
import type { IComponent } from "@/types/component.types";

interface DraggablePartProps {
  component: IComponent;
}

const DraggablePart = ({ component }: DraggablePartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: component.type,

      item: { id: component._id },

      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [component]
  );

  drag(ref);

  const tierColor = {
    "Entry-Level": "border-l-green-500",
    "Mid-Range": "border-l-cyan-500",
    "High-End": "border-l-purple-500",
  }[component.tier];

  return (
    <div
      ref={ref}
      className={`p-3 rounded-lg bg-lightfill dark:bg-darkfill border-l-4 ${tierColor} cursor-grab ${
        isDragging ? "opacity-50 scale-105" : "opacity-100"
      }`}
    >
      <p className="font-bold text-gray-900 dark:text-white">
        {component.name}
      </p>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {Object.entries(component.specs || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}
      </div>
    </div>
  );
};
export default DraggablePart;
