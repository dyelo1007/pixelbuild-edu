import React, { useState } from "react";

interface ComponentItem {
  id: number;
  name: string;
  category: string;
}

const componentsList: ComponentItem[] = [
  { id: 1, name: "CPU", category: "Processor" },
  { id: 2, name: "GPU", category: "Graphics Card" },
  { id: 3, name: "RAM", category: "Memory" },
  { id: 4, name: "Motherboard", category: "Motherboard" },
  { id: 5, name: "PSU", category: "Power Supply" },
  { id: 6, name: "Case", category: "Chassis" },
];

const BuildPage: React.FC = () => {
  const [buildComponents, setBuildComponents] = useState<ComponentItem[]>([]);
  const [isRendering, setIsRendering] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData("componentId");
    const droppedComponent = componentsList.find(
      (c) => c.id.toString() === componentId
    );

    if (
      droppedComponent &&
      !buildComponents.some((c) => c.id === droppedComponent.id)
    ) {
      setIsRendering(true); // start rendering
      setTimeout(() => {
        setBuildComponents((prev) => [...prev, droppedComponent]);
        setIsRendering(false); // stop rendering after delay
      }, 1000); // simulate short rendering delay
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    componentId: number
  ) => {
    e.dataTransfer.setData("componentId", componentId.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Components List */}
      <div
        style={{
          width: "200px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Available Components</h3>
        {componentsList.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => handleDragStart(e, component.id)}
            style={{
              border: "1px solid #ddd",
              padding: "5px",
              marginBottom: "5px",
              cursor: "grab",
              background: "#f9f9f9",
            }}
          >
            {component.name}
          </div>
        ))}
      </div>

      {/* Build Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          flex: 1,
          minHeight: "300px",
          border: "2px dashed #999",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        {isRendering ? (
          <p style={{ fontStyle: "italic", color: "#555" }}>Rendering...</p>
        ) : buildComponents.length > 0 ? (
          <div>
            <h3>Current Build</h3>
            <p>{buildComponents.map((c) => c.name).join(" + ")}</p>
          </div>
        ) : (
          <p>Drag and drop components here</p>
        )}
      </div>
    </div>
  );
};

export default BuildPage;
