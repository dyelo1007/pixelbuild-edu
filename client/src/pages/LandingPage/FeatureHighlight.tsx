import { motion } from "framer-motion";
import { fadeInUp } from "./animation/animation";

const FeatureHighlight = () => {
  return (
    <motion.div
      className="text-white mt-14 mb-8 text-center px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={fadeInUp}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="block font-bold text-2xl md:text-4xl">
          PC Building made simple!
        </h1>
        <span className="block mt-4 text-sm md:text-base text-gray-300">
          We’ve simplified the process of building a PC from scratch! Whether
          you're a beginner or a tech enthusiast, Pixel Build guides you every
          step of the way.
        </span>
      </div>
    </motion.div>
  );
};

export default FeatureHighlight;
