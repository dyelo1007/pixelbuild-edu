import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaEnvelope, FaCube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin-dashboard" : "/home";
  return (
    <footer className="relative w-full mt-40">
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl z-10">
        <div className="bg-neonblue rounded-2xl p-8 md:p-10 text-center shadow-lg flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
            Ready to Start Your Build?
          </h2>
          <p className="text-sm md:text-base text-black/80 leading-relaxed mb-6 max-w-xl">
            Your dream PC is just a few clicks away. Dive into our interactive
            guides and start building with confidence today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-neonblue font-semibold rounded-full shadow-md hover:bg-gray-200"
          >
            <Link to="/guide">Explore Building Guides</Link>
          </Button>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-lightbg dark:bg-darkbg border-t-4 border-neonblue w-full text-gray-900 dark:text-white pt-48 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Socials */}
            <div className="md:col-span-2">
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-bold mb-4"
              >
                <FaCube className="text-neonblue" />
                <span>PixelBuild</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pr-8">
                The ultimate platform to choose PC parts, simulate builds, and
                master the art of computer hardware through interactive
                learning.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-neonblue/30 text-neonblue hover:bg-neonblue/10 hover:text-neonblue"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </Button>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-neonblue/30 text-neonblue hover:bg-neonblue/10 hover:text-neonblue"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </Button>
                </a>
                <a href="pixelbuild.cs114@gmail.com" aria-label="Email">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-neonblue/30 text-neonblue hover:bg-neonblue/10 hover:text-neonblue"
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>

            {/*  Navigation Links */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Navigate
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <Link
                    to={dashboardPath}
                    className="hover:text-neonblue transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/build" className="hover:text-neonblue transition">
                    Free Build
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="hover:text-neonblue transition">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quiz-mode"
                    className="hover:text-neonblue transition"
                  >
                    Quizzes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Resources
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <Link to="/about" className="hover:text-neonblue transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about#contact"
                    className="hover:text-neonblue transition"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-and-policy"
                    className="hover:text-neonblue transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-and-condition"
                    className="hover:text-neonblue transition"
                  >
                    Terms and Condition
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 dark:border-white/20 mt-8 pt-6 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                © {new Date().getFullYear()}{" "}
                <span className="text-neonblue font-medium">PixelBuild</span>.
                All Rights Reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Designed & Built for Learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
