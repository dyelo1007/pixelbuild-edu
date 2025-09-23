import { Routes, Route } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";

import LandingPage from "./pages/LandingPage/LandingPage";
import VerifyCode from "./auth/VerifyCode";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Home-Dashboard/Home";
import PrivateRoute from "./auth/PrivateRoute";
import ForgotPassword from "./auth/ForgotPassword";
import ResetCode from "./auth/ResetCode";
import ResetPassword from "./auth/ResetPassword";

// newly added
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import BuildPage from "./pages/BuildPage/BuildPage";
import Guide from "./pages/Guide/Guide";
import AboutPage from "./pages/AboutPage";

// dashboard pages
import ChallengeMode from "./pages/Home-Dashboard/ChallengeMode/ChallengeMode";
import QuizMode from "./pages/Home-Dashboard/QuizMode/QuizMode";
import QuizTake from "./pages/Home-Dashboard/QuizMode/QuizTake";
import QuizSummary from "./pages/Home-Dashboard/QuizMode/QuizSummary";
import RepairMode from "./pages/Home-Dashboard/RepairMode/RepairMode";
import SimulationMode from "./pages/Home-Dashboard/SimulationMode/SimulationMode";

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
        <Route path="/guide" element={<Guide />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Protected Routes with Navbar */}
      <Route element={<PrivateRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/build" element={<BuildPage />} />
          <Route path="/challenge-mode" element={<ChallengeMode />} />
          {/** QUIZZES */}
          <Route path="/quiz-mode" element={<QuizMode />} />
          <Route path="/quiz/:moduleId" element={<QuizTake />} />
          <Route path="/quiz-summary" element={<QuizSummary />} />
          {/** */}
          <Route path="/repair-mode" element={<RepairMode />} />
          <Route path="/simulation-mode" element={<SimulationMode />} />
          {/* future protected routes */}
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
