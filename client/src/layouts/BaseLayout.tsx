import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "@/pages/LandingPage/Footer";
import darkBg from "/pb-bg.png";
import lightBg from "/pb-bg-light.png";
import { useTheme } from "@/components/theme-provider";

const BaseLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const bgImage = theme === "dark" ? darkBg : lightBg;

  const showFooterOnPaths = ["/", "/home", "/about", "/guide"];
  const shouldShowFooter = showFooterOnPaths.includes(location.pathname);
  return (
    <div
      className="min-h-screen bg-black"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default BaseLayout;
