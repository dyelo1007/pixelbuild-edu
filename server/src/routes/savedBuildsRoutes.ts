// routes/savedBuilds.ts
import express from "express";
import { protect } from "../middleware/auth.middleware";
import { saveBuild, getUserBuilds } from "../controllers/savedBuildsController";

const router = express.Router();

router.post("/", protect, saveBuild);
router.get("/", protect, getUserBuilds);

export default router;
