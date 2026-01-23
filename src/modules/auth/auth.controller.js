import jwt from "jsonwebtoken";
import { AuthModel } from "./auth.model.js";
import { AuthService } from "./auth.service.js";
import { AuthValidation } from "./auth.validation.js";
import { hashToken } from "../../utils/tokenHash.js";
import { UserModel } from "../users/users.model.js";
import { AccessService } from "../permissions/acces.service.js";
import { UsersService } from "../users/users.service.js";

/*
  AUTH CONTROLLER - controler pentru autentificare
  - Gestionează cererile legate de autentificare, înregistrare, deconectare, reîmprospătare token, recuperare și resetare parolă
*/
export const AuthController = {

/*
  REFRESH TOKEN - reîmprospătare token
  - Verifică dacă token-ul de reîmprospătare este prezent în cookie-uri
  - Verifică dacă token-ul este valid și nu a fost revocat
  - Dacă este valid, generează un nou token de acces și un nou token de reîmprospătare
  - Revocă token-ul de reîmprospătare vechi
  - Returnează noul token de acces și setează noul token de reîmprospătare în cookie-uri
*/
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
      abilities: abilities
    });
  },

  /*
    REGISTER - înregistrare utilizator
    - Validează datele de intrare
    - Creează un nou utilizator în baza de date
    - Returnează un mesaj de succes și detaliile utilizatorului creat
  */
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

  /*
    LOGIN - autentificare utilizator
    - Validează datele de intrare
    - Verifică dacă utilizatorul există și parola este corectă
    - Generează un token de acces și un token de reîmprospătare
    - Setează token-ul de reîmprospătare în cookie-uri
    - Returnează detaliile utilizatorului, token-ul de acces și abilitățile acestuia
  */
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

    const abilities = await AccessService.resolveAbilities(result.user.id_utilizator);
    // Return user and success
    return res.json({
      user: result.user,
      abilities: abilities,
      token: result.accessToken
    });
  },
  
  /*
    LOGOUT - deconectare utilizator
    - Preia token-ul de reîmprospătare din cookie-uri
    - Revocă token-ul de reîmprospătare în baza de date
    - Șterge cookie-ul de token de reîmprospătare
    - Returnează un mesaj de succes
  */
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

  /*
    RECOVER PASSWORD - recuperare parolă
    - Validează datele de intrare
    - Trimite un email cu instrucțiuni de recuperare a parolei
    - Returnează un mesaj de succes
  */
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

  /*
    RESET PASSWORD - resetare parolă
    - Validează datele de intrare
    - Resetează parola utilizatorului folosind token-ul de resetare
    - Returnează un mesaj de succes
  */
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
