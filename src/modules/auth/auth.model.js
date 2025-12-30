import pool from "../../config/db.js";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { hashToken } from "../../utils/tokenHash.js";

export const AuthModel = {
    TABLE: "admin.utilizatori",
    async findUser(nume_complet, parola_hash ) {
      
      const result = await pool.query(
        `SELECT id_utilizator, nume_complet, email, parola_hash, activ, sters_la FROM ${this.TABLE}
        WHERE nume_complet = $1
        LIMIT 1`,
        [nume_complet]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      // Compare provided password with stored bcrypt hash
      const isMatch = await bcrypt.compare(parola_hash, user.parola_hash);

      if (!isMatch) {
        return null;
      }

      return {
        id_utilizator: user.id_utilizator,
        nume_complet: user.nume_complet,
        email: user.email,
        activ: user.activ,
        sters_la: user.sters_la
      };
  },

  async saveRecoveryToken(email, token) {
    return pool.query(
      `
      UPDATE admin.utilizatori
      SET recovery_token = $1, recovery_expires = NOW() + INTERVAL '15 minutes'
      WHERE email = $2
      `,
      [token, email]
    );
  },

  async findByRecoveryToken(token) {
    const result = await pool.query(
      `
      SELECT * FROM admin.utilizatori
      WHERE recovery_token = $1 AND recovery_expires > NOW()
      LIMIT 1
      `,
      [token]
    );
    return result.rows[0] || null;
  },

  async updatePassword(id, newPassword) {
    const hashed = hashPassword(newPassword);

    return pool.query(
      `
      UPDATE admin.utilizatori
      SET parola_hash = $1, recovery_token = NULL, recovery_expires = NULL
      WHERE id_utilizator = $2
      `,
      [hashed, id]
    );
  },

  async saveRefreshToken({ userId, tokenHash, expiresAt }) {
    await pool.query(
      `
      INSERT INTO admin.refresh_tokens (id_utilizator, token_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [userId, tokenHash, expiresAt]
    );
  },

  async removeToken() {
    await pool.query(
      `UPDATE admin.refresh_tokens SET revoked = NOW() WHERE token_hash = $1`,
      [matched.token_hash]
    );

    res.clearCookie("refresh_token", { path: "/api/auth" });
    res.json({ success: true });
  },

  async revoke(token_hash) {
    await pool.query(`
      UPDATE admin.refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = $1
        AND revoked_at IS NULL
    `, [token_hash]);
  },
  
  async findValid(token_hash) {
    const result = await pool.query(`
      SELECT *
      FROM admin.refresh_tokens
      WHERE token_hash = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `, [token_hash]);

    return result.rows[0];
  }
};
