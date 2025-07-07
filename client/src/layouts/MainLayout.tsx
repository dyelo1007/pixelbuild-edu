import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">PixelBuild Edu</nav>
      {/* not yet final */}

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
