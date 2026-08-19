import { Request, Response } from "express";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import sendEmail from "../utils/sendEmail";
// import crypto from "crypto";
import { yupResolver } from "@hookform/resolvers/yup";

export const register = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword, secretCode } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }
    const testing = 100;
    const hashedPassword = await bcrypt.hash(password, 10);

    let role = "student";
    if (secretCode && secretCode.trim() === process.env.ADMIN_SECRET) {
      role = "admin";
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 5 * 60 * 1000); //5mins
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      verificationCode,
      verificationCodeExpires,
    });

    //send email
    const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #212121; border-radius: 12px;">
    <div style="max-width: 520px; margin: auto; background-color: #2a2a2a; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; color: #ffffff;">
      <img src="https://pixelbuild-edu.onrender.com/pb-titlelogo.png" alt="Logo"width="104" height="64" style="display: block; margin: 0 auto 16px auto;" />

      <h2 style="font-size: 24px; font-weight: bold; color: #ffffff;">Welcome, ${username}!</h2>
      <p style="font-size: 16px; color: #d0d0d0; margin: 16px 0 24px;">
        Thanks for joining! To verify your email, enter the code below in the app. This code will expire in 5 minutes.
      </p>

      <div style="font-size: 32px; font-weight: bold; background-color: #51ab91; color: #212121; padding: 16px 0; border-radius: 10px; letter-spacing: 6px; margin-bottom: 24px;">
        ${verificationCode}
      </div>

      <p style="font-size: 14px; color: #aaaaaa;">
        If you didn’t request this, feel free to ignore this email.
      </p>

      <p style="margin-top: 32px; font-size: 13px; color: #888888;">
        Need help? Contact us at
        <a href="pixelbuild.cs114@gmail.com" style="color: #51ab91; text-decoration: none;">pixelbuild.cs114@gmail.com</a>
      </p>
    </div>
  </div>
`;

    let emailSent = false;
    try {
      await sendEmail(
        user.email,
        "Your PixelBuild Verification Code",
        `Your verification code is: ${verificationCode}. It will expire in 5 minutes.`,
        htmlTemplate
      );
      emailSent = true;
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(201).json({
      message: emailSent
        ? "User registered. A verification code was sent to your email. Please verify to log in"
        : "User registered, but email could not be sent. Please use resend code.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const now = new Date();
    if (user.verificationCode !== code || user.verificationCodeExpires! < now) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Verification failed", error: err });
  }
};

export const resendCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.verificationCode = newCode;
    user.verificationCodeExpires = newExpiry;
    await user.save();

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #212121; border-radius: 12px">
        <div style="max-width: 520px; margin: auto; background-color: #2a2a2a; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; color: #ffffff;">
         <img src="https://pixelbuild-edu.onrender.com/pb-titlelogo.png" alt="Logo"width="104" height="64" style="display: block; margin: 0 auto 16px auto;" />
    
          <h2 style="font-size: 24px; font-weight: bold; color: #ffffff;">Hello again, ${user.username}!</h2>
          <p style="font-size: 16px; color: #d0d0d0; margin: 16px 0 24px;">
            Here's your new verification code. Please enter it in the app within the next 5 minutes to verify your email.
          </p>
    
          <div style="font-size: 32px; font-weight: bold; background-color: #51ab91; color: #212121; padding: 16px 0; border-radius: 10px; letter-spacing: 6px; margin-bottom: 24px;">
            ${newCode}
          </div>
    
          <p style="font-size: 14px; color: #aaaaaa;">
            If you didn’t request this, feel free to ignore this email.
          </p>
    
          <p style="margin-top: 32px; font-size: 13px; color: #888888;">
            Need help? Contact us at
            <a href="mailto:pixelbuild.cs114@gmail.com" style="color: #51ab91; text-decoration: none;">pixelbuild.cs114@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    let emailSent = false;
    try {
      await sendEmail(
        user.email,
        "Your New PixelBuild Verification Code",
        `Your new verification code is: ${newCode}. It will expire in 5 minutes.`,
        htmlTemplate
      );
      emailSent = true;
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    return res.status(200).json({
      message: emailSent
        ? "New code sent to your email."
        : "Code updated, but email could not be sent. Please try again.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to resend code", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "8h",
      }
    );

    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: { username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #212121; border-radius: 12px;">
        <div style="max-width: 520px; margin: auto; background-color: #2a2a2a; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; color: #ffffff;">
           <img src="https://pixelbuild-edu.onrender.com/pb-titlelogo.png" alt="Logo"width="104" height="64" style="display: block; margin: 0 auto 16px auto;" />

          <h2 style="font-size: 24px; font-weight: bold; color: #ffffff;">Reset Your Password</h2>
          <p style="font-size: 16px; color: #d0d0d0; margin: 16px 0 24px;">
            We received a request to reset your password. Use the code below to proceed. This code will expire in 10 minutes.
          </p>

          <div style="font-size: 32px; font-weight: bold; background-color: #51ab91; color: #212121; padding: 16px 0; border-radius: 10px; letter-spacing: 6px; margin-bottom: 24px;">
            ${resetCode}
          </div>

          <p style="font-size: 14px; color: #aaaaaa;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <p style="margin-top: 32px; font-size: 13px; color: #888888;">
            Need help? Contact us at
            <a href="mailto:pixelbuild.cs114@gmail.com" style="color: #51ab91; text-decoration: none;">pixelbuild.cs114@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    let emailSent = false;
    try {
      await sendEmail(
        email,
        "PixelBuild Password Reset Code",
        `Your reset code is: ${resetCode}. It will expire in 10 minutes.`,
        html
      );
      emailSent = true;
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(200).json({
      message: emailSent
        ? "Reset code sent to your email"
        : "Reset code created, but email could not be sent. Please use resend.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpires! < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful. Please log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const verifyResetCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpires! < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    return res.status(200).json({ message: "Reset code verified" });
  } catch (err) {
    return res.status(500).json({ message: "Verification failed", error: err });
  }
};

export const resendResetCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newResetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newResetExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetCode = newResetCode;
    user.resetCodeExpires = newResetExpiry;
    await user.save();

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #212121; border-radius: 12px">
        <div style="max-width: 520px; margin: auto; background-color: #2a2a2a; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center; color: #ffffff;">
            <img src="https://pixelbuild-edu.onrender.com/pb-titlelogo.png" alt="Logo"width="104" height="64" style="display: block; margin: 0 auto 16px auto;" />

          <h2 style="font-size: 24px; font-weight: bold; color: #ffffff;">Reset Code Request</h2>
          <p style="font-size: 16px; color: #d0d0d0; margin: 16px 0 24px;">
            You requested a new reset code. Enter the code below in the app to reset your password. This code will expire in 10 minutes.
          </p>

          <div style="font-size: 32px; font-weight: bold; background-color: #51ab91; color: #212121; padding: 16px 0; border-radius: 10px; letter-spacing: 6px; margin-bottom: 24px;">
            ${newResetCode}
          </div>

          <p style="font-size: 14px; color: #aaaaaa;">
            If you didn’t request this, just ignore this email.
          </p>

          <p style="margin-top: 32px; font-size: 13px; color: #888888;">
            Need help? Contact us at
            <a href="mailto:pixelbuild.cs114@gmail.com" style="color: #51ab91; text-decoration: none;">pixelbuild.cs114@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    let emailSent = false;
    try {
      await sendEmail(
        user.email,
        "PixelBuild Password Reset Code (Resend)",
        `Your reset code is: ${newResetCode}. It will expire in 10 minutes.`,
        html
      );
      emailSent = true;
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(200).json({
      message: emailSent
        ? "Reset code resent to your email."
        : "Code updated, but email could not be sent. Please try again.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
