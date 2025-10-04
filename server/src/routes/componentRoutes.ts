import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getAllComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} from "../controllers/componentController";

const router = Router();

// All component management routes are for admins only.
router.use(protect, adminOnly);

router.route("/").get(getAllComponents).post(createComponent);

router.route("/:id").put(updateComponent).delete(deleteComponent);

export default router;
