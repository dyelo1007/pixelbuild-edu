import { guideContent } from "./GuideData";

type GuideContentProps = {
  selected: string;
};

const GuideContent = ({ selected }: GuideContentProps) => {
  const content =
    guideContent[`Components > ${selected}` as keyof typeof guideContent];

  return (
    <div
      className="flex-1 h-full bg-lightbg dark:bg-darkbg border-neonblue border-2 rounded-2xl 
      p-6 sm:p-8 shadow-lg overflow-y-auto"
    >
      {/* Header */}
      <h1 className="text-neonblue text-2xl mb-6 font-bold">{selected}</h1>

        {/* Description */}
        {content?.description && (
          <p className="text-base text-gray-800 dark:text-[#d6faff] leading-relaxed mb-8">
            {content.description}
          </p>
        )}

        {/* Sub Header 1 */}
        {content?.subHeader1 && (
          <>
            <hr className="border-t border-[#00ffcc]/20 my-6" />
            <h2 className="text-lg font-semibold text-[#00ffcc] mb-3 tracking-wide">
              {content.subHeader1}
            </h2>
          </>
        )}
        {content?.body1 && (
          <p className="text-sm dark:text-[#e3f6f9] text-gray-700 leading-relaxed mb-6">
            {content.body1}
          </p>
        )}

        {/* Sub Header 2 */}
        {content?.subHeader2 && (
          <>
            <hr className="border-t border-[#00ffcc]/20 my-6" />
            <h2 className="text-lg font-semibold text-[#00ffcc] mb-3 tracking-wide">
              {content.subHeader2}
            </h2>
          </>
        )}
        {content?.body2 && (
          <p className="text-sm dark:text-[#e3f6f9] text-gray-700 leading-relaxed mb-6">
            {content.body2}
          </p>
        )}

      {/* Image Placeholder */}
      {content?.image && (
        <div className="w-full flex justify-center mb-6 text-black dark:text-white">
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
          className="outline-2 outline-neonblue dark:text-white text-neonblue hover:text-white dark:hover:text-black hover:bg-neonblue font-semibold px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          onClick={() => window.open(content.youtubeLink, "_blank")}
        >
          Watch on YouTube
        </button>
      )}
    </div>
  );
};

export default GuideContent;
