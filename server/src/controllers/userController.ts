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
    const { username, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (req.file) {
      user.image = req.file.filename; // or full URL if preferred
    }
    await user.save();


    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

