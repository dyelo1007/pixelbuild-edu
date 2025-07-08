import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  token?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" }, // for future admin
  isVerified: { type: Boolean, default: false },

  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
  token: { type: String },
});

export const User = mongoose.model<IUser>("User", userSchema);
