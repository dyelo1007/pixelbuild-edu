import { Router } from "express";
import {
  getAllParts,
  getPartById,
} from "../controllers/partsController";

const router = Router();

router.get("/", getAllParts);
router.get("/:id", getPartById);

export default router;
