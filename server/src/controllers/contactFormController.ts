import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail";

export const handleContactForm = async (req: Request, res: Response) => {
  const { name, username, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required." });
  }

  const adminEmail = process.env.EMAIL_USER;
  if (!adminEmail) {
    console.error("Admin email (EMAIL_USER) is not configured.");
    return res
      .status(500)
      .json({ message: "Server error: Email configuration is missing." });
  }

  const subject = `New Contact Message from ${name}`;
  const textContent = `You have a new message from:\n\nName: ${name}\nUsername: ${
    username || "Not provided"
  }\nEmail: ${email}\n\nMessage:\n${message}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0B1220; border-radius: 12px;">
      <div style="max-width: 520px; margin: auto; background-color: #0F1724; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); color: #ffffff;">
        <img src="https://pixelbuild-edu.onrender.com/pb-titlelogo.png" alt="PixelBuild Logo" width="124" height="64" style="display: block; margin: 0 auto 24px auto;" />
        
        <h2 style="font-size: 24px; font-weight: bold; color: #51ab91; text-align: center;">New Contact Submission</h2>
        
        <div style="font-size: 16px; color: #d0d0d0; margin: 24px 0;">
          <p style="margin: 8px 0;"><strong>From:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Username:</strong> ${
            username || "Not provided"
          }</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #51ab91; text-decoration: none;">${email}</a></p>
        </div>

        <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;" />

        <div>
            <h3 style="font-size: 18px; font-weight: bold; color: #ffffff; margin-bottom: 12px;">Message:</h3>
            <p style="font-size: 16px; color: #d0d0d0; line-height: 1.6; white-space: pre-wrap; background-color: #0B1220; padding: 16px; border-radius: 8px;">${message}</p>
        </div>

        <p style="margin-top: 32px; font-size: 13px; color: #888888; text-align: center;">
          This message was sent via the contact form on PixelBuild Edu.
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail(adminEmail, subject, textContent, htmlContent);
    res.status(200).json({
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
};
