import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
  const { token, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return token && user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
