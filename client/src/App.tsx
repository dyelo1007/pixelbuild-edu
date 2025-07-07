import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/LandingPage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* future shits */}
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
