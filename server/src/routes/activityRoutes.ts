import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getUserActivity } from "../controllers/activityController";

const router = Router();

router.get("/", protect, getUserActivity);

export default router;
