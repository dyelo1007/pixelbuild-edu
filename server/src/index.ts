import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

// Import your routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/admin.route";
import partsRoutes from "./routes/partsRoutes";
import savedBuildsRoutes from "./routes/savedBuildsRoutes";
import quizRoutes from "./routes/quizRoutes";
import reviewSetRoutes from "./routes/reviewSetRoutes";
import compatibilityRoutes from "./routes/compatibility";
import componentRoutes from "./routes/componentRoutes";
import puzzleRoutes from "./routes/puzzleRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import activityRoutes from "./routes/activityRoutes";
import dashboardRoutes from "./routes/adminDashboardRoutes";
import contactRoutes from "./routes/contactFormRoutes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// Configure CORS to use the CLIENT_URL from your environment variables
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Use the environment variable
    credentials: true,
  })
);

app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/savedbuilds", savedBuildsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/review-sets", reviewSetRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/puzzles", puzzleRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);

// --- Simple Root Route ---
// A simple check to see if the API is running
const __dirname_resolved = path.resolve();
app.use("/uploads", express.static(path.join(__dirname_resolved, "/uploads")));

app.get("/", (req, res) => {
  res.send("✅ PixelBuild API is running...");
});

app.get("/ping", (req, res) => res.send("OK"));

// --- Database Connection and Server Start ---
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error(" MongoDB connection error", err));
