import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentRoute = () => {
  const { token, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Must be logged in AND a student
  if (token && user && user.role === "student") {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default StudentRoute;
