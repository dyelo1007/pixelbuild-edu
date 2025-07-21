import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";

const envPath = path.resolve(__dirname, "../.env");
console.log("🔎 Loading .env from:", envPath);
dotenv.config({ path: envPath });

console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "🔐 EMAIL_PASS:",
  process.env.EMAIL_PASS ? "[loaded]" : "❌ still missing"
);
console.log(
  "🛠 MONGO_URI:",
  process.env.MONGO_URI ? "[loaded]" : "❌ still missing"
);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.log(" MongoDB error", err));
