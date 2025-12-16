import { AccountRecoveryService } from "./account.recovery.service.js";

export const AccountRecoveryController = {
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AccountRecoveryService.createRecovery(email);
      return res.json({
        message: "If the account exists, a recovery email was sent."
      });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, new_password } = req.body;
      await AccountRecoveryService.resetPassword(token, new_password);
      return res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
};
