import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Study the Guides",
    description:
      "Learn the fundamentals of each PC part, from CPUs to power supplies, in our comprehensive, easy-to-understand guides.",
    link: "/guide",
    linkText: "Explore Guides",
  },
  {
    title: "Test Your Knowledge",
    description:
      "Reinforce what you've learned with interactive quizzes and solve real-world compatibility puzzles in Challenge Mode.",
    link: "/challenge-mode",
    linkText: "Try a Challenge",
  },
  {
    title: "Build with Confidence",
    description:
      "Apply your skills in our zero-pressure sandbox. Design, save, and perfect your dream PC builds.",
    link: "/build",
    linkText: "Start Building",
  },
];

const fadeInStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
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

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-lightfill dark:bg-darkfill rounded-xl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Your Journey Starts Here
          </h2>
        </motion.div>

        <motion.div
          variants={fadeInStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative p-8 border-2 border-dashed border-neonblue/30 rounded-2xl bg-lightbg dark:bg-darkbg shadow-md flex flex-col"
            >
              <div className="absolute -top-5 -left-5 w-14 h-14 flex items-center justify-center rounded-full bg-neonblue text-black font-bold text-2xl border-4 border-lightfill dark:border-darkfill">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold text-neonblue mb-4 mt-6">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                {step.description}
              </p>
              <Button
                asChild
                variant="link"
                className="text-neonblue p-0 h-auto mt-4 self-start"
              >
                <Link to={step.link}>{step.linkText} &rarr;</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
