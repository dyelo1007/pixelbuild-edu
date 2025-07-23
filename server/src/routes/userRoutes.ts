// src/routes/user.routes.ts
import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getMe, updateMe } from "../controllers/userController";
import { upload } from "../middleware/fileUpload.middleware";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("image"), updateMe);

export default router;
