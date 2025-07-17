import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import OpenerImg from "../assets/landing-page-imgs/pb-opener.png";
import DragImg from "../assets/landing-page-imgs/pb-dragdrop-pic.png";
import pc1Img from "../assets/landing-page-imgs/pb-budgetpc.png";
import pc2Img from "../assets/landing-page-imgs/pb-midend.png";
import pc3Img from "../assets/landing-page-imgs/pb-whitethemed.png";

{
  /**pre built pc objects */
}
const builds = [
  {
    img: pc1Img,
    name: "Budget PC",
    price: "₱15,000",
  },
  {
    img: pc2Img,
    name: "Mid-End PC",
    price: "₱30,000",
  },
  {
    img: pc3Img,
    name: "White-Themed PC",
    price: "₱50,000",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-start h-screen rounded-3xl outline-2 outline-neonblue overflow-hidden px-6 md:px-10 ">
        {/* Background Image */}
        <img
          src={OpenerImg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Foreground Content */}
        <div className="z-10 text-center md:text-left md:pl-10 max-w-2xl">
          <p className="text-base md:text-lg text-shadow-lg text-white my-3">
            Upgrade your PC Building Experience
          </p>
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight md:leading-[5.5rem] font-extrabold text-white my-3 text-shadow-lg">
            Start Building Your Dream PC!
          </p>

          <button
            className="bg-primary text-white font-bold px-6 sm:px-8 md:px-10 py-2 md:py-3 rounded-3xl md:rounded-4xl text-base sm:text-lg my-3 shadow-2xl cursor-pointer"
            onClick={handleGetStarted}
          >
            Sign In to Build
          </button>
        </div>
      </div>

      {/**Pre build text*/}
      <div className="flex mt-24 items-center justify-items-start">
        <div className=" flex items-center justify-center">
          <span className="text-white font-medium text-4xl">
            Pre-Built Templates
          </span>
          <span className="bg-neonblue text-white mx-3 px-3 py-1 rounded-sm">
            With Estimated Prices
          </span>
        </div>
      </div>
      <div className="w-xl mt-3">
        <span className="text-white text-lg">
          Choose from these templates that suit your needs and budget. Each
          template comes with estimated prices to help you get started fast!
        </span>
      </div>
      {/**Pre build template grid*/}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4 mb-28">
        {builds.map((build, index) => (
          <div
            key={index}
            className="bg-darkblue border-2 border-dashed border-neonblue rounded-xl p-4 flex flex-col items-center max-w-sm mx-auto"
          >
            <img
              src={build.img}
              alt={build.name}
              className="h-60 object-contain rounded-lg"
            />
            <h3 className="text-white text-xl font-bold mt-4 text-center">
              {build.name}
            </h3>
            <span className="mt-2 inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {build.price}
            </span>
          </div>
        ))}
      </div>

      {/**PC Building made simple*/}
      <div className="text-white mt-14 mb-8 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="block font-bold text-2xl md:text-4xl">
            PC Building made simple!
          </h1>
          <span className="block mt-4 text-sm md:text-base text-gray-300">
            We’ve simplified the process of building a PC from scratch! Whether
            you're a beginner or a tech enthusiast, Pixel Build guides you every
            step of the way—from selecting parts to checking compatibility and
            estimating total cost.
          </span>
        </div>
      </div>
      {/**card grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10 mt-8 text-center">
        {/* Card 1 */}
        <div className="w-full max-w-md mx-auto border-2 border-dashed border-neonblue rounded-xl p-6 bg-gray-800 shadow-md">
          <h2 className="text-2xl font-bold text-neonblue mb-4 text-center">
            Pick your purpose
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed text-center">
            Are you building a rig for gaming, content creation, or everyday
            tasks? Choosing your purpose helps us recommend the right components
            tailored to your goals.
          </p>
        </div>

        {/* Card 2 */}
        <div className="w-full max-w-md mx-auto border-2 border-dashed border-neonblue rounded-xl p-6 bg-gray-800 shadow-md">
          <h2 className="text-2xl font-bold text-neonblue mb-4 text-center">
            Choose the Right Components
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed text-center">
            Browse from a wide selection of GPUs, CPUs, motherboards, and more.
            Our system checks compatibility for you—no need to worry about
            mismatched parts!
          </p>
        </div>

        {/* Card 3 */}
        <div className="w-full max-w-md mx-auto border-2 border-dashed border-neonblue rounded-xl p-6 bg-gray-800 shadow-md">
          <h2 className="text-2xl font-bold text-neonblue mb-4 text-center">
            Finalize Your Build
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed text-center">
            Double-check your setup, get estimated costs, and see a summary of
            performance benchmarks. Ready? Save your build or continue to
            purchase links.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-8 py-12 rounded-3xl md:pl-10 w-full md:w-full mt-10 text-center md:text-left">
        {/* Text Section */}
        <div className="md:w-1/2 text-white mb-10 md:mb-0 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight md:leading-[3rem] mx-auto md:mx-0">
            Drag-and-Drop Feature!
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed mt-3 mx-auto md:mx-0">
            Build your PC visually with our easy-to-use drag-and-drop tool. Just
            pick the parts you need, drop them into your build, and watch your
            dream setup come to life in real time. No tech skills required!
          </p>
          <button
            className="bg-primary text-white font-bold px-6 py-2 rounded-4xl text-base sm:text-lg shadow-2xl cursor-pointer"
            onClick={handleGetStarted}
          >
            Sign In to Build
          </button>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={DragImg}
            alt="Drag and Drop Feature"
            className="max-w-xs sm:max-w-sm w-full"
          />
        </div>
      </div>
    </>
  );
};

export default Landing;
