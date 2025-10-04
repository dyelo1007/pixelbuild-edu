import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./animation/animation";

import pc1Img from "../../assets/landing-page-imgs/pb-budgetpc.png";
import pc2Img from "../../assets/landing-page-imgs/pb-midend.png";
import pc3Img from "../../assets/landing-page-imgs/pb-whitethemed.png";

const builds = [
  { img: pc1Img, name: "Budget PC", price: "₱15,000" },
  { img: pc2Img, name: "Mid-End PC", price: "₱30,000" },
  { img: pc3Img, name: "White-Themed PC", price: "₱50,000" },
];

const BuildCards = () => {
  return (
    <motion.div
      className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4 mb-28"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      {builds.map((build, index) => (
        <motion.div
          key={index}
          className="build-card dark:bg-darkblue bg-lightbgfill border-2 border-dashed border-neonblue rounded-xl p-4 flex flex-col items-center max-w-sm mx-auto"
          variants={fadeInUp}
        >
          <img
            src={build.img}
            alt={build.name}
            className="h-60 object-contain rounded-lg"
          />
          <h3 className="dark:text-white text-gray-800 text-xl font-bold mt-4 text-center">
            {build.name}
          </h3>
          <span className="mt-2 inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {build.price}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BuildCards;
