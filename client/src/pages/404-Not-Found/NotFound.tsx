import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/auth/context/AuthContext";

const NotFound = () => {
  const { user } = useAuth();
  let homePath = "/";
  if (user) {
    homePath = user.role === "admin" ? "/admin-dashboard" : "/home";
  }
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-lightbg dark:bg-darkbg border border-neonblue/20 text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-neonblue">
              404
            </h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved or deleted.
            </p>
            <Button
              asChild
              className="mt-6 bg-neonblue text-black hover:bg-hoverprimary"
            >
              <Link to={homePath}>Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
