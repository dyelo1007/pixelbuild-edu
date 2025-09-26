import React from "react";
import { useDrag } from "react-dnd";

type DraggablePartProps = {
  part: string;
};

const DraggablePart: React.FC<DraggablePartProps> = ({ part }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "PART",
      item: { part },
      collect: (monitor) => ({
        isDragging: Boolean(monitor.isDragging()),
      }),
    }),
    [part]
  );

  return (
    <div
      // cast the ref to avoid TS error with react-dnd ref callback
      ref={dragRef as unknown as (el: HTMLDivElement | null) => void}
      className={`px-3 py-2 rounded-lg shadow-md cursor-move select-none transition ${
        isDragging
          ? "opacity-50 bg-gray-600 text-black"
          : "bg-darkblue text-white hover:bg-hoverprimary"
      }`}
    >
      {part}
    </div>
  );
};

export default DraggablePart;
