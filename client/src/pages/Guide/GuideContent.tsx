import { guideContent } from "./GuideData";

const GuideContent = ({ selected }) => {
  const content = guideContent[`Components > ${selected}`];

  return (
    <div
      className="flex-1 h-full bg-darkbg border-neonblue border-2 rounded-2xl 
    p-6 sm:p-8 shadow-lg overflow-y-auto"
    >
      {/* Header */}
      <h1 className="text-neonblue text-2xl mb-6 font-bold">{selected}</h1>

      {/* Description */}
      {content?.description && (
        <p className="text-md text-gray-300 leading-relaxed mb-8">
          {content.description}
        </p>
      )}

      {/* Sub Header 1 */}
      {content?.subHeader1 && (
        <h2 className="text-lg font-semibold text-white mb-2">
          {content.subHeader1}
        </h2>
      )}
      {content?.body1 && (
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          {content.body1}
        </p>
      )}

      {/* Sub Header 2 */}
      {content?.subHeader2 && (
        <h2 className="text-lg font-semibold text-white mb-2">
          {content.subHeader2}
        </h2>
      )}
      {content?.body2 && (
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          {content.body2}
        </p>
      )}

      {/* Image Placeholder */}
      {content?.image && (
        <div className="w-full flex justify-center mb-6">
          <img
            src={content.image}
            alt={selected}
            className="max-w-md rounded-lg shadow-md"
          />
        </div>
      )}

      {/* YouTube button */}
      {content?.youtubeLink && content.youtubeLink !== "" && (
        <button
          className="outline-2 outline-neonblue text-white hover:bg-neonblue font-semibold px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          onClick={() => window.open(content.youtubeLink, "_blank")}
        >
          Watch on YouTube
        </button>
      )}
    </div>
  );
};

export default GuideContent;
