import { fadeInUp } from "./animation/animation";
import { motion } from "framer-motion";

const TemplateIntro = () => {
  return (
    <>
      <motion.div
        className="flex mt-24 items-center justify-items-start"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="flex items-center justify-center">
          <span className="text-white font-medium text-4xl">
            Pre-Built Templates
          </span>
          <span className="bg-neonblue text-white mx-3 px-3 py-1 rounded-sm">
            With Estimated Prices
          </span>
        </div>
      </motion.div>

      <motion.div
        className="w-xl mt-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUp}
      >
        <span className="text-white text-lg">
          Choose from these templates that suit your needs and budget. Each
          template comes with estimated prices to help you get started fast!
        </span>
      </motion.div>
    </>
  );
};

export default TemplateIntro;
