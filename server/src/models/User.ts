import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  bio?: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  token?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  resetCode?: string;
  resetCodeExpires?: Date;
  testing: number;
  image?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" }, // for future admin
  isVerified: { type: Boolean, default: false },
  testing: { type: Number },
  image: { type: String },

  bio: { type: String },

  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
  token: { type: String },

  resetCode: { type: String },
  resetCodeExpires: { type: Date },
});

export const User = mongoose.model<IUser>("User", userSchema);
