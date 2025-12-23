import crypto, { createHash } from "crypto";
import { AccountRecoveryModel } from "./account.recovery.model.js";
import { hashPassword } from "../../utils/hash.js";
import { sendMail } from "../../utils/mailer.js";
import { hashToken } from "../../utils/tokenHash.js";

export const AccountRecoveryService = {
  async createRecovery(email) {
    const user = await AccountRecoveryModel.findUserByEmail(email);
    if (!user) return; // prevent user enumeration

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    await AccountRecoveryModel.storeToken({
      userId: user.id_utilizator,
      tokenHash
    });

    const recoveryLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendMail({
      to: email,
      subject: "Password Recovery",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${recoveryLink}">${recoveryLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
    });
  },

  async resetPassword(token, newPassword) {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const record = await AccountRecoveryModel.findValidToken(tokenHash);
    if (!record) {
      throw new Error("Invalid or expired token");
    }

    const passwordHash = await hashPassword(newPassword);

    await AccountRecoveryModel.updatePassword(
      record.utilizator_id,
      passwordHash
    );

    await AccountRecoveryModel.invalidateToken(record.id);
  }
};
