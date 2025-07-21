// src/routes/user.routes.ts
import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getMe, updateMe } from "../controllers/userController";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
