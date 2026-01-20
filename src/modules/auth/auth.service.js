import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthModel } from "./auth.model.js";
import { UserModel } from "../users/users.model.js";
import { hashToken } from "../../utils/tokenHash.js";

/*
  AuthService handles user registration, login, password recovery, and logout.
*/
export const AuthService = {

  /* Registers a new user if the email is not already in use. */
  async register(data) {
    const userExists = await AuthModel.findUser(data.email);
    if (userExists) return { error: "Email deja folosit." };

    return await UserModel.create(data);
  },

  /* Logs in a user by verifying credentials and issuing tokens. */
  async login(nume_complet, parola_hash) {
    const user = await AuthModel.findUser(nume_complet, parola_hash);
    if (!user) return { error: "Utilizator inexistent." };
    const userErrors = {
      missing: "Utilizator inexistent.",
      inactive: "Cont inactiv. Contactează administratorul.",
      deleted: "Cont șters. Contactează administratorul."
    };
    if (!user) return { error: userErrors.missing };
    if (!user.activ) return { error: userErrors.inactive };
    if (user.sters) return { error: userErrors.deleted };
    // ACCESS TOKEN (short)
    const accessToken = jwt.sign(
      {
        id: user.id_utilizator,
        nume_complet: user.nume_complet
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN (long) ✅ FIXED
    const refreshToken = jwt.sign(
      { id: user.id_utilizator },process.env.JWT_REFRESH_SECRET,{ expiresIn: "8h" }
    );

    await AuthModel.saveRefreshToken({
      userId: user.id_utilizator,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000)
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  },

  /* Sends a password recovery token to the user's email. */
  async sendRecovery(email) {
    const user = await AuthModel.findByEmail(email);
    if (!user) return { error: "Email inexistent." };

    const token = crypto.randomBytes(20).toString("hex");

    await AuthModel.saveRecoveryToken(email, token);

    return { email, token };
  },

  /* Resets the user's password using the recovery token. */
  async resetPassword(token, newPassword) {
    const user = await AuthModel.findByRecoveryToken(token);
    if (!user) return { error: "Token expirat sau invalid." };

    await AuthModel.updatePassword(user.id_utilizator, newPassword);

    return { success: true };
  },
  
  /* Logs out the user by revoking the refresh token. */
  async logout(refreshToken) {
    if (!refreshToken) return;
    const tokenHash = hashToken(refreshToken);
    await AuthModel.revoke(tokenHash);
  }
};
