import { Request, Response } from "express";
import { User } from "../models/User";

// Get all students
export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

//Get all users studs and admins

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("username email role badges"); // include necessary fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get student by ID
export const getStudentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

// pdate student info
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student" });
  }
};

// Delete student
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student" });
  }
};

//mama mo promote
export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    ).select("-password");

    if (!student) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User promoted to admin", user: student });
  } catch (error) {
    res.status(500).json({ message: "Failed to promote user" });
  }
};

// @desc    Get total student count
export const getStudentCount = async (req: Request, res: Response) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.json({ count });
  } catch (err) {
    console.error("Error fetching student count:", err);
    res.status(500).json({ message: "Server error" });
  }
};
