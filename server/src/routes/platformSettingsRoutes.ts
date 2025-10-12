import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "../controllers/platformSettingsController";

const router = Router();

// This route is public so the frontend can check which modes are visible
router.get("/", getPlatformSettings);

// This route is protected so only admins can change the settings
router.put("/", protect, adminOnly, updatePlatformSettings);

export default router;
