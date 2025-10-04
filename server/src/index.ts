import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // Ensure cors is imported

// Import your routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/admin.route";
import partsRoutes from "./routes/partsRoutes";
import savedBuildsRoutes from "./routes/savedBuildsRoutes";
import quizRoutes from "./routes/quizRoutes";
import reviewSetRoutes from "./routes/reviewSetRoutes";
import compatibilityRoutes  from "./routes/compatibility"

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

//  Middleware
//  Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite dev server's address
    credentials: true,
  })
);

app.use(express.json());

// --- 2. API Routes ---
//  All API routes must be defined before the frontend routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/savedbuilds", savedBuildsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/review-sets", reviewSetRoutes);
app.use("/api/compatibility", compatibilityRoutes);

//  Frontend Integration (for Production)
// This part serves your built React app
const __dirname_resolved = path.resolve();
app.use("/uploads", express.static(path.join(__dirname_resolved, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname_resolved, "/frontend/dist")));

  //  "catch-all" route sends any request that is not an API call to the React app
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname_resolved, "frontend", "dist", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

//  Database Connection and Server Start
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.log(" MongoDB error", err));
