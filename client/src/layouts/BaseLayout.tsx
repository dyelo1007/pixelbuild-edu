// src/layouts/BaseLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const BaseLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
