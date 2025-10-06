import { guideData, type GuideArticle } from "./GuideData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// Define the shape of the 'selected' state object
type SelectedState = {
  category: string;
  articleKey: string;
};

type SidebarProps = {
  selected: SelectedState;
  setSelected: (value: SelectedState) => void;
};

const Sidebar = ({ selected, setSelected }: SidebarProps) => {
  return (
    <Card className="w-full lg:w-80 lg:max-w-xs shrink-0 bg-lightbg dark:bg-darkbg border border-neonblue/20">
      <CardHeader>
        <CardTitle className="text-xl text-neonblue">Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={guideData.map((g) => g.category)}
          className="w-full"
        >
          {guideData.map((group) => (
            <AccordionItem
              key={group.category}
              value={group.category}
              className="border-neonblue/20"
            >
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-white hover:no-underline">
                {group.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {Object.keys(group.articles).map((articleKey) => {
                    const article = group.articles[articleKey] as GuideArticle;
                    const isSelected =
                      selected.category === group.category &&
                      selected.articleKey === articleKey;

                    return (
                      <Button
                        key={article.title}
                        onClick={() =>
                          setSelected({ category: group.category, articleKey })
                        }
                        variant="ghost"
                        className={`w-full justify-start text-left h-auto py-2 px-3 
                          ${
                            isSelected
                              ? "bg-neonblue/10 text-neonblue font-semibold"
                              : "text-gray-700 dark:text-gray-300 hover:bg-neonblue/5 hover:text-neonblue"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5">{article.icon}</span>
                          <span>{article.title}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
