import { useAuth } from "../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 text-center">
      <h1 className="text-3xl font-bold">Welcome, {user?.username} 👋</h1>
      <p className="text-gray-600 mt-2">Email: {user?.email}</p>
      <p className="text-gray-600">Role: {user?.role || "student"}</p>

      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
