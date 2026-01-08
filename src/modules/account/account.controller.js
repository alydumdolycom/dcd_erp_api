import { AccountService } from "./account.service.js";
import { sendMail } from "../../utils/mailer.js";
import transporter from "../../config/mailer.js";

export const AccountController = {
  async forgotPassword(req, res, next) {
    console.log(req.body.email);
    transporter.sendMail({
      from: '"DCD ERP" <brad@sandboxa1f7cdebbcf64ec6b718a3deeed05f22.mailgun.org>',
      to: req.body.email,
      subject: "Password Recovery",
      text: "This is a test email for password recovery.",
    });
    return res.json({ message: "Test email sent." });
    // try {
    //   const { email } = req.body;
    //   await AccountService.create(email);
    //   return res.json({
    //     message: "If the account exists, a recovery email was sent."
    //   });
    // } catch (err) {
    //   next(err);
    // }
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
