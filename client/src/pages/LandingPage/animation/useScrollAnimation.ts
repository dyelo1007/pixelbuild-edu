import { useRef, useEffect } from "react";
import { useInView, useAnimation } from "framer-motion";

const useScrollAnimation = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return [ref, controls] as const;
};

export default useScrollAnimation;
