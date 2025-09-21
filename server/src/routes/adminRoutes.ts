import express from "express";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/auth.middleware";

const router = express.Router();

// Temporary test route for admins only
router.get("/test", protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: "✅ You are an Admin and can access this route",
    userId: req.user,  // so you can check which user is logged in
  });
});

export default router;
