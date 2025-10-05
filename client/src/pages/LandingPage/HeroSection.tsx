import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import OpenerImg from "../../assets/landing-page-imgs/pb-opener.png";
import OpenerImg2 from "../../assets/landing-page-imgs/pb-opener2.png";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/auth/context/AuthContext";

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

const Hero = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bgImage = theme === "dark" ? OpenerImg : OpenerImg2;

  const handleGetStarted = () => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } else {
      navigate("/register");
    }
  };
  return (
    <section
      className="relative min-h-screen flex items-center px-4 sm:px-6 rounded-3xl"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0 rounded-3xl"></div>

      <motion.div
        variants={fadeInStagger}
        initial="hidden"
        animate="visible"
        className="max-w-3xl z-10 text-center sm:text-left"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
        >
          Start Building Your <span className="text-neonblue">Dream PC</span>{" "}
          Today
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mt-4 text-lg text-gray-200 max-w-2xl"
        >
          PixelBuild Edu provides the tools and knowledge you need to build with
          confidence. Learn, create, and master the art of PC building.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
        >
          <Button
            size="lg"
            className="bg-neonblue text-black hover:bg-hoverprimary"
            onClick={handleGetStarted}
          >
            Get Started for Free
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-black dark:text-white border-white hover:bg-white hover:text-black "
          >
            <a href="#features">Explore Features</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
