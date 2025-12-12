import pool from "../../config/db.js";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../../utils/hash.js";

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
      email: user.email
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
  }
};
