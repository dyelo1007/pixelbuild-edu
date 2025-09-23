import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { token, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Must be logged in AND an admin
  if (token && user && user.role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default AdminRoute;
