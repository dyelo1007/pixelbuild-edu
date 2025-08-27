import { useAuth } from "@/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // animation
import Sidebar from "./Sidebar";
import GuideContent from "./GuideContent";

const Guide = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState("Processor (CPU)");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <motion.div
      className="min-h-screen text-white py-6 px-4 sm:px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto lg:h-[calc(100vh-5rem)]">
        <Sidebar
          selected={selectedComponent}
          setSelected={setSelectedComponent}
        />
        <GuideContent selected={selectedComponent} />
      </div>
    </motion.div>
  );
};

export default Guide;
