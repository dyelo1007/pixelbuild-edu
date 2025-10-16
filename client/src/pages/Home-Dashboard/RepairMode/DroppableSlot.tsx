import React from "react";
import { useDrop } from "react-dnd";

type DroppableSlotProps = {
  slot: string;
  value: string;
  onDropPart: (part: string) => void;
  isSelected?: boolean;
};

const DroppableSlot: React.FC<DroppableSlotProps> = ({
  slot,
  value,
  onDropPart,
}) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "PART",
      drop: (item: any) => {
        // console logs for debugging stuff
        // console.log("Dropped item on", slot, item);
        onDropPart(item.part);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [slot, onDropPart]
  );

  return (
    <div
      ref={dropRef as unknown as (el: HTMLDivElement | null) => void}
      className={`p-4 rounded-xl shadow-md text-center transition min-h-[64px] ${
        isOver ? "bg-neonblue text-black" : "bg-darkblue text-white"
      }`}
    >
      <h3 className="text-gray-300 text-sm mb-2">{slot}</h3>
      <p className="font-semibold">{value}</p>
    </div>
  );
};

export default DroppableSlot;
