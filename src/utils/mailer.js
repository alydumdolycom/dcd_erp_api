import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // smtp.mailgun.org
  port: Number(process.env.SMTP_PORT),   // 587
  secure: process.env.SMTP_SECURE === "true", // false for 587, true for 465
  auth: {
    user: process.env.SMTP_USER,         // full email address
    pass: process.env.SMTP_PASSWORD      // generated SMTP password
  }
});

// Optional but VERY useful (run on app start)
export async function verifyMailer() {
  await transporter.verify();
  console.log("📧 Mailgun SMTP connected");
}

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM, // "ERP System <no-reply@...>"
    to,
    subject,
    html
  });
}
