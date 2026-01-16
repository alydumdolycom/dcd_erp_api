import jwt from "jsonwebtoken";
import { AuthModel } from "./auth.model.js";
import { AuthService } from "./auth.service.js";
import { AuthValidation } from "./auth.validation.js";
import { hashToken } from "../../utils/tokenHash.js";
import { UserModel } from "../users/users.model.js";
// import { RoleModel } from "../roles/roles.model.js";
import { AccessService } from "../permissions/acces.service.js";

export const AuthController = {

// controllers/auth.controller.js
  async refresh(req, res) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "Lipsa token de reîmprospătare" });
    }

    const refreshTokenHash = hashToken(refreshToken);
    const stored = await AuthModel.findValid(refreshTokenHash);
    if (!stored) {
      return res.status(401).json({ message: "Token de reîmprospătare invalid" });
    }

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

    } catch (err) {
      return res.status(401).json({ message: "Token de reîmprospătare expirat", error: err.message });
    }

    // 🔁 ROTATE TOKEN
    await AuthModel.revoke(refreshTokenHash);
    
    const user = await UserModel.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Utilizatorul nu a fost găsit" });
    }
    const newRefreshToken = jwt.sign(
      { id: payload.id, user: user },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    const abilities = await AccessService.resolveAbilities(user.id_utilizator);
    await AuthModel.saveRefreshToken({
      userId: payload.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    const newAccessToken = jwt.sign(
      {
        id: user.id_utilizator,
        nume_complet: user.nume_complet,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    return res.json({
      token: newAccessToken,
      abilities: abilities,
    });
  },

  async register(req, res) {
    const errors = AuthValidation.register(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const created = await AuthService.register(req.body);
    if (created.error) return res.status(400).json({ error: created.error });

    return res.status(201).json({
      success: true,
      message: "Cont creat cu succes.",
      user: created
    });
  },

  async login(req, res) {

    const errors = AuthValidation.login(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { nume_complet, parola_hash } = req.body;
    const result = await AuthService.login(nume_complet, parola_hash);

    if (result.error) return res.status(400).json({ error: result.error });

    // Set refresh token cookie
    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000 // 8h
    });

    const access = await AccessService.resolveAbilities(result.user.id_utilizator);
    // Return user and success
    return res.json({
      success: true,
      user: result.user,
      access: access,
      token: result.accessToken
    });
  },
  
  async logout(req, res) {
    const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Clear refresh token cookie
      res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
      });

      return res.json({
        success: true,
        message: "Deconectat cu succes."
      });
  },

  async recover(req, res) {
    const errors = AuthValidation.recover(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await AuthService.sendRecovery(req.body.email);
    if (result.error) return res.status(400).json({ error: result.error });

    return res.json({
      success: true,
      message: "Email cu instrucțiuni trimis."
    });
  },

  async resetPassword(req, res) {
    const errors = AuthValidation.reset(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await AuthService.resetPassword(
      req.body.token,
      req.body.parola_hash
    );

    if (result.error) return res.status(400).json({ error: result.error });

    return res.json({
      success: true,
      message: "Parolă actualizată."
    });
  }
};
