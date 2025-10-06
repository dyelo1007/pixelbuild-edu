import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FaMicrochip,
  FaPuzzlePiece,
  FaQuestionCircle,
  FaBookOpen,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMicrochip className="w-8 h-8" />,
    title: "Free Build Sandbox",
    description:
      "Drag, drop, and assemble any components in a zero-pressure environment. Save your builds and learn as you go.",
  },
  {
    icon: <FaPuzzlePiece className="w-8 h-8" />,
    title: "Challenge Mode",
    description:
      "Solve compatibility puzzles designed by instructors to test your practical knowledge in real-world scenarios.",
  },
  {
    icon: <FaQuestionCircle className="w-8 h-8" />,
    title: "Quiz Mode",
    description:
      "Reinforce your knowledge with interactive quizzes that cover everything from basic terms to advanced concepts.",
  },
  {
    icon: <FaBookOpen className="w-8 h-8" />,
    title: "Review Mode",
    description:
      "Create your own custom flashcard sets. Take control of your learning and practice what matters most to you.",
  },
];

// Animation variants for Framer Motion
const fadeInStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            A Better Way to Learn
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            PixelBuild Edu replaces boring tutorials with engaging, hands-on
            experiences that build real skills.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              variants={fadeInUp}
              key={feature.title}
              className="h-full"
            >
              <Card className="bg-lightbg dark:bg-darkbg border border-neonblue/20 h-full text-center sm:text-left transition-all duration-300 hover:border-neonblue hover:shadow-lg hover:shadow-neonblue/10 hover:-translate-y-2">
                <CardHeader className="items-center sm:items-start">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-neonblue/10 text-neonblue">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
