import express from "express";

import {
  register,
  login,
  verifyCode,
  resendCode,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register); // User signs up, gets 6-digit code
router.post("/login", login); // Login allowed only if verified
router.post("/verify-code", verifyCode); // POST { email, code }
router.post("/resend-code", resendCode); // POST { email }

export default router;
