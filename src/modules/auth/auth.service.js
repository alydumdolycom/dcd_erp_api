import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthModel } from "./auth.model.js";
import { UserModel } from "../users/users.model.js";
import { hashToken } from "../../utils/tokenHash.js";

export const AuthService = {

  async register(data) {
    const userExists = await AuthModel.findUser(data.email);
    if (userExists) return { error: "Email deja folosit." };

    return await UserModel.create(data);
  },

  async login(nume_complet, parola_hash) {
    const user = await AuthModel.findUser(nume_complet, parola_hash);
    if (!user) return { error: "Utilizator inexistent." };
 
    const accessToken = jwt.sign(
      {
        id: user.id_utilizator,
        nume_complet: user.nume_complet
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN (lung)
    const refreshToken = jwt.sign(
      { id: user.id_utilizator },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // add a day
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

  async sendRecovery(email) {
    const user = await AuthModel.findByEmail(email);
    if (!user) return { error: "Email inexistent." };

    const token = crypto.randomBytes(20).toString("hex");

    await AuthModel.saveRecoveryToken(email, token);

    return { email, token };
  },

  async resetPassword(token, newPassword) {
    const user = await AuthModel.findByRecoveryToken(token);
    if (!user) return { error: "Token expirat sau invalid." };

    await AuthModel.updatePassword(user.id_utilizator, newPassword);

    return { success: true };
  },
  async logout(token) {
    await AuthModel.removeToken(token);
  }
};
