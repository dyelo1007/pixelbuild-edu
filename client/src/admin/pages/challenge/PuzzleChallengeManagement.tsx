import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaCogs, FaPuzzlePiece, FaTrophy } from "react-icons/fa";

const PuzzleChallengeManagement = () => {
  const managementAreas = [
    {
      title: "Component Library",
      description:
        "Manage the database of all PC parts. Create, edit, or delete CPUs, Motherboards, RAM, etc.",
      link: "/admin/components",
      icon: <FaCogs className="w-8 h-8 text-neonblue" />,
    },
    {
      title: "Puzzle Management",
      description:
        "Assemble individual components from your library into compatibility puzzles.",
      link: "/admin/puzzles",
      icon: <FaPuzzlePiece className="w-8 h-8 text-neonblue" />,
    },
    {
      title: "Challenge Management",
      description:
        "Group your puzzles together into playable challenges for students.",
      link: "/admin/challenges/list",
      icon: <FaTrophy className="w-8 h-8 text-neonblue" />,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neonblue">
          Challenge Mode Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          A three-step process: Create components, build puzzles, then group
          them into challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementAreas.map((area) => (
          <Link to={area.link} key={area.title} className="group">
            <Card className="bg-lightbg dark:bg-darkbg border border-neonblue/20 group-hover:border-neonblue transition-colors h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                {area.icon}
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    {area.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{area.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PuzzleChallengeManagement;
