import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import darkBg from "/pb-bg.png";
import lightBg from "/pb-bg-light.png";
import { useTheme } from "@/components/theme-provider";

const BaseLayout = () => {
  const { theme } = useTheme();

  const bgImage = theme === "dark" ? darkBg : lightBg;
  return (
    <div
      className="min-h-screen bg-black"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
