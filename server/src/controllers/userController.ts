import { Request, Response } from "express";
import { User } from "../models/User";

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const { testing } = req.body;

    if (typeof testing !== "number") {
      return res.status(400).json({ message: "Invalid 'testing' value. Must be a number." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.testing = testing;
    await user.save();

    return res.status(200).json({
      message: "'testing' field updated successfully",
      testing: user.testing,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
