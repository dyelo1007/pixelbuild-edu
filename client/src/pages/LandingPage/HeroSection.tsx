import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OpenerImg from "../../assets/landing-page-imgs/pb-opener.png";
import OpenerImg2 from "../../assets/landing-page-imgs/pb-opener2.png";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/home" : "/login");
  };

  return (
    <motion.div
      className="relative flex flex-col md:flex-row items-center justify-center md:justify-start h-screen rounded-3xl overflow-hidden px-6 md:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <img
        src={OpenerImg}
        alt="Background dark"
        className="absolute inset-0 w-full h-full object-cover z-0 dark:block hidden"
      />
      <img
        src={OpenerImg2}
        alt="Background light"
        className="absolute inset-0 w-full h-full object-cover z-0 block dark:hidden"
      />
      <motion.div
        className="z-10 text-center md:text-left md:pl-10 max-w-2xl"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <p className="text-base md:text-lg text-shadow-lg dark:text-white text-black my-3">
          Upgrade your PC Building Experience
        </p>
        <p className="text-4xl sm:text-5xl md:text-6xl text-shadow-amber-50 lg:text-7xl tracking-tight md:leading-[5.5rem] font-extrabold dark:text-white text-gray-900 my-3 text-shadow-lg">
          Start Building Your Dream PC!
        </p>
        <button
          className="bg-neonblue text-white font-bold px-6 sm:px-8 md:px-10 py-2 md:py-3 rounded-3xl text-base sm:text-lg my-3 shadow-2xl cursor-pointer"
          onClick={handleGetStarted}
        >
          Sign In to Build
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
