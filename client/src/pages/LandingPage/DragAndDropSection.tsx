// src/pages/landing-page/DragDropSection.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fadeInUp } from "./animation/animation";
import DragImg from "../../assets/landing-page-imgs/pb-dragdrop-pic.png";

const DragAndDropSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login");
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-8 py-12 rounded-3xl md:pl-10 w-full mt-10 text-center md:text-left"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={fadeInUp}
    >
      <div className="md:w-1/2 dark:text-white text-gray-900 mb-10 md:mb-0 max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight md:leading-[3rem] mx-auto md:mx-0">
          Drag-and-Drop Feature!
        </h2>
        <p className="text-base sm:text-lg dark:text-gray-300 text-gray-800 mb-6 leading-relaxed mt-3 mx-auto md:mx-0">
          Build your PC visually with our easy-to-use drag-and-drop tool. Just
          pick the parts you need, drop them into your build, and watch your
          dream setup come to life.
        </p>
        <button
          className="bg-primary text-white font-bold px-6 py-2 rounded-4xl text-base sm:text-lg shadow-2xl cursor-pointer"
          onClick={handleGetStarted}
        >
          Sign In to Build
        </button>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <img
          src={DragImg}
          alt="Drag and Drop Feature"
          className="max-w-xs sm:max-w-sm w-full"
        />
      </div>
    </motion.div>
  );
};

export default DragAndDropSection;
