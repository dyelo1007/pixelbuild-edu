
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  // If a SendGrid API key is provided, use SendGrid (recommended for production)
  if (sendgridApiKey) {
    sgMail.setApiKey(sendgridApiKey);
    const msg = {
      to: to,
      from: process.env.EMAIL_FROM || "pixelbuild.cs114@gmail.com", // Use the email you verified on SendGrid
      subject: subject,
      text: text,
      html: html,
    };
    try {
      await sgMail.send(msg);
      console.log("Email sent successfully with SendGrid");
    } catch (error) {
      console.error("Error sending email with SendGrid:", error);
      // If SendGrid fails, you could log the error or have a fallback
      if ((error as any).response) {
        console.error((error as any).response.body);
      }
      throw error; // Re-throw the error to be caught by the calling function
    }
  } else {
    // Fallback to Nodemailer for local development if no SendGrid key is found
    console.warn(
      "SENDGRID_API_KEY not found. Falling back to Nodemailer for local development."
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
      throw error; // Re-throw the error
    }
  }
};

export default sendEmail;
