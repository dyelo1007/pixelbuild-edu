import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./animation/animation";

const stepDescriptions = [
  "Are you building a rig for gaming, content creation, or everyday tasks? Choosing your purpose helps us recommend the right components tailored to your goals.",
  "Browse from a wide selection of GPUs, CPUs, motherboards, and more. Our system checks compatibility for you—no need to worry about mismatched parts!",
  "Double-check your setup, get estimated costs, and see a summary of performance benchmarks. Ready? Save your build or continue to purchase links.",
];

const TemplateSteps = () => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10 mt-8 text-center"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      {[
        "Pick your purpose",
        "Choose the Right Components",
        "Finalize Your Build",
      ].map((title, i) => (
        <motion.div
          key={i}
          className="template-step w-full max-w-md mx-auto border-2 border-dashed border-neonblue rounded-xl p-6 dark:bg-gray-800 bg-lightbgfill shadow-md"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold text-neonblue mb-4 text-center">
            {title}
          </h2>
          <p className="dark:text-gray-200 text-gray-800 text-sm leading-relaxed text-center">
            {stepDescriptions[i]}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TemplateSteps;
