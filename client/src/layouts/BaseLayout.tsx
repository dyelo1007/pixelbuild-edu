// src/layouts/BaseLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import bg from "/pb-bg.png";

const BaseLayout = () => {
  return (
    <div
      className="min-h-screen bg-black"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
