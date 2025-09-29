import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllUsers,
  promoteToAdmin,
  getStudentCount
} from "../controllers/adminController";

const router = Router();

// ✅ Admin-only routes
router.get("/students", protect, adminOnly, getAllStudents);
router.get("/students/:id", protect, adminOnly, getStudentById);
router.get("/count", getStudentCount); 
router.put("/students/:id", protect, adminOnly, updateStudent);
router.delete("/students/:id", protect, adminOnly, deleteStudent);
router.get("/users", protect, adminOnly, getAllUsers);

export default router;
