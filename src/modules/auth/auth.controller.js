import { AuthService } from "./auth.service.js";
import { AuthValidation } from "./auth.validation.js";

export const AuthController = {
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

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000 // 8h
    });

    // 🔐 Returnezi DOAR access token
    return res.json({
      success: true,
      user: result.user,
      token: result.accessToken
    });
    
  },
  
  async logout(req, res) {
    await AuthService.logout(req.token);
    res.clearCookie("token");
    res.json({ 
      success: true,
      message: "Utilizator deconectat"
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
