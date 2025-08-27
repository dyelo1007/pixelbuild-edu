// component for the contents

const GuideSection = ({ title, description, youtubeLink }) => {
  return (
    <div>
      <p className="text-md text-gray-300 leading-relaxed mb-6">
        {description}
      </p>
      <button
        className="outline-2 outline-neonblue text-white hover:bg-neonblue font-semibold px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
        onClick={() => window.open(youtubeLink, "_blank")}
      >
        Watch on YouTube
      </button>
    </div>
  );
};

export default GuideSection;
