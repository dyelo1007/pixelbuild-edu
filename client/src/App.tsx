import { Routes, Route } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";

import LandingPage from "./pages/LandingPage/LandingPage";
import VerifyCode from "./auth/VerifyCode";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";
import ForgotPassword from "./auth/ForgotPassword";
import ResetCode from "./auth/ResetCode";
import ResetPassword from "./auth/ResetPassword";

{
  /** PROFILE */
}
import AccountSettings from "./pages/AccountSettings/AccountSettings";

const App = () => {
  return (
    <Routes>
      {/* public Routes with Navbar */}
      <Route element={<BaseLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyCode />} />

        {/* forgot pass route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-code" element={<ResetCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes with Navbar */}
      <Route element={<PrivateRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* future protected routes */}
          <Route path="/account-settings" element={<AccountSettings />} />{" "}
          {/* ADDED THIS FOR PROFILE*/}
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
