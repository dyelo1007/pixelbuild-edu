import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// console.log(" EMAIL_USER:", process.env.EMAIL_USER);
// console.log(
//   " EMAIL_PASS:",
//   process.env.EMAIL_PASS ? "[loaded]" : " still missing"
// );
// console.log(
//   " MONGO_URI:",
//   process.env.MONGO_URI ? "[loaded]" : "still missing"
// );

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(" Transport error:", error);
  } else {
    console.log(" Server is ready to take messages");
  }
});

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const info = await transporter.sendMail({
    from: `"PixelBuild" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("📧 Email sent:", info.messageId);
};

export default sendEmail;
