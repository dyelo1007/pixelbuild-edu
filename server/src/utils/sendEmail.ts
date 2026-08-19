import nodemailer from "nodemailer";
import { Resend } from "resend";

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

    try {
      await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
      console.log("Email sent successfully with Resend");
    } catch (error) {
      console.error("Error sending email with Resend:", error);
      throw error;
    }
  } else {
    console.warn(
      "RESEND_API_KEY not found. Falling back to Nodemailer for local development."
    );

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(
        "Nodemailer credentials (EMAIL_USER, EMAIL_PASS) are not set."
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PixelBuild Edu" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully with Nodemailer");
    } catch (error) {
      console.error("Error sending email with Nodemailer:", error);
      throw error;
    }
  }
};

export default sendEmail;
