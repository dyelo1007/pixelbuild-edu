import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  saveBuild,
  getUserBuilds,
  getBuildById,
  deleteBuild,
  updateBuild,
  generateOrUpdateReviewSet,
} from "../controllers/savedBuildsController";

const router = express.Router();

router.post("/", protect, saveBuild);
router.get("/", protect, getUserBuilds);
router.get("/:id", protect, getBuildById);
router.delete("/:id", protect, deleteBuild);
router.put("/:id", protect, updateBuild);
router.post("/:id/generate-review", protect, generateOrUpdateReviewSet);

export default router;
