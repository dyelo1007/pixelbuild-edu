import type { GuideArticle } from "./GuideData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaYoutube } from "react-icons/fa";

type GuideContentProps = {
  article: GuideArticle | undefined;
};

const GuideContent = ({ article }: GuideContentProps) => {
  // If no article is found (e.g., on initial load or error), show a placeholder.
  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-gray-500">
          Select a topic from the left to get started.
        </p>
      </div>
    );
  }

  return (
    <Card className="flex-1 h-full bg-lightbg dark:bg-darkbg border-neonblue/20 shadow-lg lg:max-h-[calc(100vh-5rem)]">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-neonblue">
          {article.title}
        </CardTitle>
        <CardDescription className="text-base text-gray-600 dark:text-gray-400 pt-1">
          {article.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[calc(100%-120px)] pr-2">
        <div className="space-y-6">
          {/* {article.image && (
            <div className="w-full flex justify-center my-4">
              <img
                src={article.image}
                alt={article.title}
                className="max-w-md w-full h-auto rounded-lg shadow-md border border-neonblue/10"
              />
            </div>
          )} */}

          {article.content.map((section, index) => (
            <section key={index} className="space-y-2">
              <Separator className="bg-neonblue/20" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white pt-4">
                {section.subHeader}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {section.body}
              </p>
            </section>
          ))}

          {article.youtubeLink && (
            <div className="pt-4">
              <Separator className="bg-neonblue/20" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white pt-6 mb-4">
                Further Learning
              </h3>
              <Button
                onClick={() => window.open(article.youtubeLink, "_blank")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <FaYoutube className="mr-2 h-5 w-5" /> Watch on YouTube
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideContent;
