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
import { ThemeProvider } from "@/components/theme-provider";

// admin
import AdminDashboard from "./admin/Dashboard/AdminDashboard";
import StudentsPage from "./admin/pages/Students";

const App = () => {
  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/guide" element={<Guide />} />{" "}
          {/** added for guide page */}
          <Route path="/about" element={<AboutPage />} />{" "}
          {/** added for about page */}
        </Route>

        {/* Protected Routes with Navbar */}
        <Route element={<PrivateRoute />}>
          <Route element={<BaseLayout />}>

              {/* Build routes */}
            <Route path="/build" element={<BuildPage />} />
            <Route path="/build/:id" element={<BuildPage />} />
            
            <Route path="/home" element={<Dashboard />} />
            <Route path="/build" element={<BuildPage />} />
            <Route path="/challenge-mode" element={<ChallengeMode />} />
            <Route path="/quiz-mode" element={<QuizMode />} />
               {/** QUIZZES */}
            <Route path="/quiz-mode" element={<QuizMode />} />
             <Route path="/quiz/:moduleId" element={<QuizTake />} />
             <Route path="/quiz-summary" element={<QuizSummary />} />
            <Route path="/repair-mode" element={<RepairMode />} />
            <Route path="/simulation-mode" element={<SimulationMode />} />
            {/* TEMPORARY BC NASA STUDENT E2!! IKAW NA BAHALA HERE KYLE */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            {/* future protected routes */}
            <Route
              path="/account-settings"
              element={<AccountSettings />}
            />{" "}
            {/* ADDED THIS FOR PROFILE*/}
          </Route>

        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
