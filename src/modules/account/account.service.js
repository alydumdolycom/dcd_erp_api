import crypto, { createHash } from "crypto";
import { AccountModel } from "./account.model.js";
import { hashPassword } from "../../utils/hash.js";
// import { sendMail } from "../../utils/mailer.js";
import { hashToken } from "../../utils/tokenHash.js";

export const AccountService = {
  async create(email) {
    const user = await AccountModel.findUserByEmail(email);
    if (!user) return; // prevent user enumeration

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    await AccountModel.storeToken({
      userId: user.id_utilizator,
      tokenHash
    });

    const recoveryLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // await sendMail({
    //   to: user.email,
    //   subject: "Recuperare parolă",
    //   html: `
    //     <p>Click pe link-ul de mai jos pentru a-ți reseta parola:</p>
    //     <a href="${recoveryLink}">${recoveryLink}</a>
    //     <p>Acest link expiră în 15 minute.</p>
    //   `
    // });
  },

  async resetPassword(token, newPassword) {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const record = await AccountModel.findValidToken(tokenHash);
    if (!record) {
      throw new Error("Token invalid sau expirat.");
    }

    const passwordHash = await hashPassword(newPassword);

    await AccountModel.updatePassword(
      record.utilizator_id,
      passwordHash
    );

    await AccountModel.invalidateToken(record.id);
  }
};
