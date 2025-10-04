// component for the contents
import React from "react";

type GuideSectionProps = {
  title?: string;
  description: string;
  youtubeLink: string;
};

const GuideSection: React.FC<GuideSectionProps> = ({
  title,
  description,
  youtubeLink,
}) => {
  return (
    <div>
      {title && (
        <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      )}

      <p className="text-md text-gray-300 leading-relaxed mb-6">
        {description}
      </p>

      {youtubeLink && (
        <button
          className="outline-2 outline-neonblue text-white hover:bg-neonblue font-semibold px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          onClick={() => window.open(youtubeLink, "_blank")}
        >
          Watch on YouTube
        </button>
      )}
    </div>
  );
};

export default GuideSection;
