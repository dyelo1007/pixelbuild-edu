import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getMySets,
  createSet,
  getSetById,
  updateSet,
  deleteSet,
  getMyReviewSets,
} from "../controllers/reviewSetController";

const router = Router();

router.use(protect);

router.route("/").get(getMySets).post(createSet);
router.get("/", protect, getMyReviewSets);

router.route("/:id").get(getSetById).put(updateSet).delete(deleteSet);

export default router;
