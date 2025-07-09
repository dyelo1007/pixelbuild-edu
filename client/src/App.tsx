import { Routes, Route } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";

import Landing from "./pages/LandingPage";
import VerifyCode from "./auth/VerifyCode";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Routes with Navbar */}
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyCode />} />
      </Route>

      {/* Protected Routes with Navbar */}
      <Route element={<PrivateRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* future protected routes */}
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
