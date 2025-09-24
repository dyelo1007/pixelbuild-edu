// src/pages/Home-Dashboard/QuizMode/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-lightfill dark:bg-darkfill h-2 rounded-lg overflow-hidden">
    <div
      className="h-full bg-neonblue transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);
export default ProgressBar;
