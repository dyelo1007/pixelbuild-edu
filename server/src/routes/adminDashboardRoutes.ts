import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";

import {
  getAdminStats,
  getRecentActivity,
} from "../controllers/adminDashboardController";

const router = Router();

// This router now handles both stats and activity
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/activity", protect, adminOnly, getRecentActivity);

export default router;
