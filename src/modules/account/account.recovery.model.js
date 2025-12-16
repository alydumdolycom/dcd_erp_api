import pool from "../../config/db.js";

export const AccountRecoveryModel = {
  async findUserByEmail(email) {
    const result = await pool.query(
      `SELECT id_utilizator FROM admin.utilizatori WHERE email = $1 LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  },

  async storeToken({ userId, tokenHash }) {
    await pool.query(
      `
      INSERT INTO admin.password_resets (id_utilizator, token_hash, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '15 minutes')
      `,
      [userId, tokenHash]
    );
  },

  async findValidToken(tokenHash) {
    const result = await pool.query(
      `
      SELECT *
      FROM admin.password_resets
      WHERE token_hash = $1
        AND expires_at > NOW()
        AND used = FALSE
      LIMIT 1
      `,
      [tokenHash]
    );
    return result.rows[0] || null;
  },

  async updatePassword(userId, passwordHash) {
    await pool.query(
      `
      UPDATE admin.utilizatori
      SET parola_hash = $1
      WHERE id_utilizator = $2
      `,
      [passwordHash, userId]
    );
  },

  async invalidateToken(id) {
    await pool.query(
      `UPDATE admin.password_resets SET used = TRUE WHERE id = $1`,
      [id]
    );
  }
};
