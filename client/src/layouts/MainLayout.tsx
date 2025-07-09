import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* not yet final */}
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
