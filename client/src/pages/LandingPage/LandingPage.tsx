import HeroSection from "./HeroSection";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import useScrollAnimation from "./animation/useScrollAnimation";

const LandingPage = () => {
  const [ref] = useScrollAnimation();

  return (
    <div ref={ref} className=" rounded-2xl">
      <HeroSection />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default LandingPage;
