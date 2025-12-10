import { sendEmail } from "../services/emailService.js";

export const sendWelcomeEmail = async (req, res) => {
  const { email, name } = req.body;

  const result = await sendEmail({
    to: email,
    subject: "Welcome!",
    html: `<h1>Hello ${name}</h1><p>Your account was created successfully.</p>`
  });

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.error });
  }

  res.json({ success: true, message: "Email sent!" });
};
