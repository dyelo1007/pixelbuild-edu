import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import GuideContent from "./GuideContent";
import { guideData } from "./GuideData";

const Guide = () => {
  const findDefaultSelection = () => {
    if (guideData.length > 0 && guideData[0].articles) {
      const firstArticleKey = Object.keys(guideData[0].articles)[0];
      if (firstArticleKey) {
        return {
          category: guideData[0].category,
          articleKey: firstArticleKey,
        };
      }
    }
    return { category: "", articleKey: "" };
  };

  const [selected, setSelected] = useState(findDefaultSelection());

  const selectedArticle = guideData.find(
    (cat) => cat.category === selected.category
  )?.articles[selected.articleKey];

  return (
    <motion.div
      className="p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <Sidebar selected={selected} setSelected={setSelected} />
        <GuideContent article={selectedArticle} />
      </div>
    </motion.div>
  );
};

export default Guide;
