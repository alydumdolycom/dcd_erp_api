import jwt from "jsonwebtoken";
import { UserModel } from "../users/users.model.js";
import { AuthModel } from "./auth.model.js";
import { AuthService } from "./auth.service.js";
import { AuthValidation } from "./auth.validation.js";

export const AuthController = {
  async refresh(req, res) {
    const oldToken = req.cookies.refresh_token;

      if (!oldToken) {
        return res.status(401).json({ message: "Lipsă refresh token" });
      }

      const stored = await AuthModel.findValid(oldToken);
      if (!stored) {
        return res.status(401).json({ message: "Refresh token invalid" });
      }

      try {
        // verify refresh token
        const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);

        // revoke old refresh token (rotation)
        await AuthModel.revoke(oldToken);

        const user = await UserModel.findById(payload.id);
        if (!user) return res.sendStatus(401);

        // generate NEW tokens
        const newAccessToken = jwt.sign(
          {
            id: user.id_utilizator,
            nume_complet: user.nume_complet
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
          { id: user.id_utilizator },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        // store new refresh token
        await AuthModel.create({
          userId: user.id_utilizator,
          token: newRefreshToken,
          userAgent: req.headers["user-agent"],
          ip: req.ip
        });

        // overwrite cookie
        res.cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/api/auth/refresh",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
          accessToken: newAccessToken
        });
      } catch (err) {
        return res.status(401).json({ message: "Refresh token expirat" });
      }
  },
  // async refresh(req, res) {
  //   const token = req.cookies.refresh_token;
  //   if (!token) {
  //     return res.status(401).json({ message: "Lipsa token" });
  //   }
  //   const stored = await AuthModel.findValid(token);
  //   if (!stored) {
  //     return res.status(401).json({ message: "Token de reîmprospătare invalid" });
  //   }

  //   // rotate refresh token (SECURITY)
  //   await AuthModel.revoke(token);
  //   const user = await UserModel.findById(stored.id_utilizator);

  //   const newAccessToken = jwt.sign(
  //     { 
  //       id: user.id_utilizator, nume_complet: user.nume_complet },
  //       process.env.JWT_SECRET,
  //     { expiresIn: "15m" }
  //   );

  //   return res.json({
  //     accessToken: newAccessToken,
  //     user
  //   });
  // },

  async register(req, res) {
    // const errors = AuthValidation.register(req.body);
    // if (errors.length) return res.status(400).json({ errors });

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
      if (errors.length) {
        return res.status(400).json({ errors });
      }

      const { nume_complet, parola_hash } = req.body; // plain password
      const result = await AuthService.login(nume_complet, parola_hash);

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      // ✅ Correct refresh-token cookie
      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({
        success: true,
        user: result.user,
        accessToken: result.accessToken
      });
  },
  
  async logout(req, res) {
    const token = req.cookies.refresh_token;
    if (token) {
      await AuthModel.revoke(token);
    } 
    res.clearCookie("refresh_token", { path: "/" });
    res.clearCookie("access_token", { path: "/" });
    return res.json({ success: true, message: "Deconectat cu succes." });
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
