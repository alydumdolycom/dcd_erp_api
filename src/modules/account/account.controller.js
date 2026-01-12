import { AccountService } from "./account.service.js";
import transporter from "../../config/mailer.js";
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
import nodemailer from "nodemailer";
export const AccountController = {
  async forgotPassword(req, res, next) {


    // 1. Configure the transporter with your Mailgun credentials
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org', // Mailgun SMTP hostname
        port: 587,                // Recommended port
        secure: false,            // False for port 587 (uses STARTTLS)
        auth: {
            user: 'brad@sandboxa1f7cdebbcf64ec6b718a3deeed05f22.mailgun.org',
            pass: '35ad5705fd4f0d68524098e6ccfe1d21' // Use the password you created in the Mailgun dashboard
        }
    });

    // 2. Define the email content
    const mailOptions = {
        from: '"Your Name" <postmaster@sandboxa1f7cdebbcf64ec6b718a3deeed05f22.mailgun.org>', // Must match your domain
        to: req.body.email, // Replace with your test recipient email
        subject: 'Hello from Node.js and Mailgun',
        text: 'This is a test email sent using Nodemailer and Mailgun SMTP.',
        html: '<b>This is a test email sent using Nodemailer and Mailgun SMTP.</b>'
    };

    // 3. Send the email
    async function send() {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error occurred:', error.message);
        }
    }

    send();
  },

  async resetPassword(req, res, next) {
    try {
      const { token, new_password } = req.body;
      await AccountService.resetPassword(token, new_password);
      return res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
};
