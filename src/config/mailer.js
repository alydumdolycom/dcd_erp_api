import nodemailer from "nodemailer";

// Example .env values:
// MAIL_HOST=sandbox.smtp.mailtrap.io
// MAIL_PORT=2525
// MAILTRAP_USER=f4e4927fc36005
// MAILTRAP_PASS=452ce388366396

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS
} = process.env;

if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
  throw new Error("Missing mail configuration in environment variables.");
}

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: false, // Mailtrap sandbox
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

(async () => {
  try {
    await transporter.verify();
    console.log("📧 Mailtrap SMTP connected");
  } catch (err) {
    console.error("❌ Mailtrap SMTP error:", err);
  }
})();

export default transporter;
