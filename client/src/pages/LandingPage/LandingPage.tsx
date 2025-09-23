import HeroSection from "./HeroSection";
import TemplateIntro from "./TemplateIntro";
import BuildCards from "./BuildCards";
import FeatureHighlight from "./FeatureHighlight";
import TemplateSteps from "./TemplateSteps";
import DragAndDropSection from "./DragAndDropSection";
import useScrollAnimation from "./animation/useScrollAnimation";
import Footer from "./Footer";

const LandingPage = () => {
  const [ref] = useScrollAnimation();

  return (
    <div ref={ref} className=" rounded-2xl">
      <HeroSection />
      <TemplateIntro />
      <BuildCards />
      <FeatureHighlight />
      <TemplateSteps />
      <DragAndDropSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
