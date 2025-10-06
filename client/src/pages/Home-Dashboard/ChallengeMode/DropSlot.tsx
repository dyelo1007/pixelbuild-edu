import { useRef } from "react";
import { useDrop } from "react-dnd";
import type { IComponent } from "@/types/component.types";

interface DropSlotProps {
  type: string;
  feedback?: "correct" | "incorrect" | "locked";
  lockedComponent?: IComponent;
  placedComponent?: IComponent;
  onDrop: (slotType: string, componentId: string) => void;
}

const DropSlot = ({
  type,
  feedback,
  lockedComponent,
  placedComponent,
  onDrop,
}: DropSlotProps) => {
    console.log(
    `🎯 Rendering DropSlot: type=${type}, locked=${!!lockedComponent}, placed=${!!placedComponent}, feedback=${feedback}`
  );
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: type,
      drop: (item: { id: string }) => {
        // ❌ don’t allow dropping on locked slots
        if (!lockedComponent) {
          onDrop(type, item.id);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop, type, lockedComponent]
  );

  drop(ref);

  // slot styles
  let stateClasses = "border-gray-400/50 dark:border-gray-600/50";
  if (isOver && !lockedComponent)
    stateClasses = "border-neonblue bg-neonblue/10";
  if (feedback === "correct") stateClasses = "border-green-500 bg-green-500/10";
  if (feedback === "incorrect") stateClasses = "border-red-500 bg-red-500/10";
  if (lockedComponent || feedback === "locked")
    stateClasses = "border-yellow-500 bg-yellow-500/10 cursor-not-allowed";

  // what to display
  const componentToDisplay = lockedComponent || placedComponent;

  return (
    <div
      ref={ref}
      className={`h-28 p-3 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${stateClasses}`}
    >
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        {type}
      </p>

      {lockedComponent ? (
        <div className="text-center mt-1 opacity-80">
          <p className="font-bold text-gray-900 dark:text-white">
            {lockedComponent.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {Object.entries(lockedComponent.specs || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </p>
          <p className="text-xs text-yellow-400 mt-1">(locked)</p>
        </div>
      ) : componentToDisplay ? (
        <div className="text-center mt-1">
          <p className="font-bold text-gray-900 dark:text-white">
            {componentToDisplay.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {Object.entries(componentToDisplay.specs || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 mt-1">Drop a {type} here</p>
      )}
    </div>
  );
};

export default DropSlot;
