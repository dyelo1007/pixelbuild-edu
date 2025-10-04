import { Routes, Route } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";

import LandingPage from "./pages/LandingPage/LandingPage";
import VerifyCode from "./auth/VerifyCode";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Home-Dashboard/Home";
import ForgotPassword from "./auth/ForgotPassword";
import ResetCode from "./auth/ResetCode";
import ResetPassword from "./auth/ResetPassword";

// newly added
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import BuildPage from "./pages/BuildPage/BuildPage";
import Guide from "./pages/Guide/Guide";
import AboutPage from "./pages/AboutPage";

// dashboard pages
// import ChallengeMode from "./pages/Home-Dashboard/ChallengeMode/ChallengeMode";
import QuizMode from "./pages/Home-Dashboard/QuizMode/QuizMode";
import QuizTake from "./pages/Home-Dashboard/QuizMode/QuizTake";
import QuizSummary from "./pages/Home-Dashboard/QuizMode/QuizSummary";
import RepairMode from "./pages/Home-Dashboard/RepairMode/RepairMode";
import { ThemeProvider } from "@/components/theme-provider";

// admin
import AdminDashboard from "./admin/Dashboard/AdminDashboard";
import StudentsPage from "./admin/pages/Students";

// Route Guards
import PrivateRoute from "./auth/Routes/PrivateRoute";
import AdminRoute from "./auth/Routes/AdminRoute";
import StudentRoute from "./auth/Routes/StudentRoute";
import ContentManagement from "./admin/pages/ContentManagement";
import QuizModeManagement from "./admin/pages/quiz/QuizModeManagement";
import AddQuiz from "./admin/pages/quiz/AddQuiz";
import EditQuiz from "./admin/pages/quiz/EditQuiz";
// import QuizResults from "./admin/pages/quiz/AdminQuizResults";
import QuizResultsPage from "./admin/pages/quiz/QuizResultsPage";
import ReviewModeDashboard from "./pages/Home-Dashboard/ReviewMode/ReviewModeDashboard";
import ReviewSetForm from "./pages/Home-Dashboard/ReviewMode/ReviewSetForm";
import PracticeHub from "./pages/Home-Dashboard/ReviewMode/PracticeHub";
import FlashcardPractice from "./pages/Home-Dashboard/ReviewMode/FlashcardPractice";
import QuizPractice from "./pages/Home-Dashboard/ReviewMode/QuizPractice";

//admin challenge
import PuzzleChallengeManagement from "./admin/pages/challenge/PuzzleChallengeManagement";
import ComponentLibrary from "./admin/pages/challenge/ComponentLibrary";
import PuzzleManagement from "./admin/pages/challenge/PuzzleManagement";
import PuzzleForm from "./admin/pages/challenge/PuzzleForm";
import ChallengeManagement from "./admin/pages/challenge/ChallengeManagement";
import ChallengeForm from "./admin/pages/challenge/ChallengeForm";
import AdminChallengeResults from "./admin/pages/challenge/AdminChallengeResults";

//challenge
import ChallengeMode from "./pages/Home-Dashboard/ChallengeMode/ChallengeMode";
import ChallengeTake from "./pages/Home-Dashboard/ChallengeMode/ChallengeTake";
import ChallengeSummary from "./pages/Home-Dashboard/ChallengeMode/ChallengeSummary";

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

        {/* --------- ANY AUTHENTICATED USER ROUTES -------- */}
        <Route element={<PrivateRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/build" element={<BuildPage />} />
            <Route path="/build/:id" element={<BuildPage />} />
          </Route>
        </Route>

        {/* ------------- STUDENT-ONLY ROUTES ------------- */}
        <Route element={<StudentRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/quiz-mode" element={<QuizMode />} />
            <Route path="/quiz/:moduleId" element={<QuizTake />} />
            <Route path="/quiz-summary" element={<QuizSummary />} />
            <Route path="/repair-mode" element={<RepairMode />} />
            <Route path="/review-mode" element={<ReviewModeDashboard />} />
            <Route path="/review-mode/new" element={<ReviewSetForm />} />
            <Route path="/review-mode/edit/:id" element={<ReviewSetForm />} />
            <Route path="/review-mode/practice/:id" element={<PracticeHub />} />
            {/* challenge */}
            <Route path="/challenge-mode" element={<ChallengeMode />} />
            <Route
              path="/challenge-mode/take/:challengeId"
              element={<ChallengeTake />}
            />
            <Route
              path="/challenge-mode/summary/:challengeId"
              element={<ChallengeSummary />}
            />
            <Route
              path="/review-mode/practice/flashcards/:id"
              element={<FlashcardPractice />}
            />
            <Route
              path="/review-mode/practice/quiz/:id"
              element={<QuizPractice />}
            />
          </Route>
        </Route>

        {/* -------------- ADMIN-ONLY ROUTES --------------- */}
        <Route element={<AdminRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/content-management" element={<ContentManagement />} />
            <Route path="/content/quiz-mode" element={<QuizModeManagement />} />
            <Route path="/content/quiz-mode/add" element={<AddQuiz />} />
            <Route path="/content/quiz-mode/edit/:id" element={<EditQuiz />} />
            <Route path="/quizzes/:id/results" element={<QuizResultsPage />} />

            {/* Add all the new admin routes for managing puzzles and challenges */}
            <Route
              path="/content/challenges"
              element={<PuzzleChallengeManagement />}
            />
            <Route path="/admin/components" element={<ComponentLibrary />} />
            <Route path="/admin/puzzles" element={<PuzzleManagement />} />
            <Route path="/admin/puzzles/new" element={<PuzzleForm />} />
            <Route path="/admin/puzzles/edit/:id" element={<PuzzleForm />} />
            <Route
              path="/admin/challenges/list"
              element={<ChallengeManagement />}
            />
            <Route path="/admin/challenges/new" element={<ChallengeForm />} />
            <Route
              path="/admin/challenges/edit/:id"
              element={<ChallengeForm />}
            />
            <Route
              path="/admin/challenges/:id/results"
              element={<AdminChallengeResults />}
            />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
