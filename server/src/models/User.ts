import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" }, // for future admin
  createdAt: { type: Date, default: Date.now },
  token: { type: String },
});

export const User = mongoose.model("User", userSchema);
