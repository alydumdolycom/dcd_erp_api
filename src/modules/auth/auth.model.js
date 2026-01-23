import pool from "../../config/db.js";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../../utils/hash.js";

/*
  AUTH MODEL - model pentru autentificare
  - Interacționează cu baza de date pentru operațiuni legate de autentificare, cum ar fi găsirea utilizatorilor, salvarea token-urilor de reîmprospătare și gestionarea parolelor
*/
export const AuthModel = {
    TABLE: "admin.utilizatori",

    /*
    FIND USER - găsire utilizator
      - Caută un utilizator în baza de date după numele complet și verifică parola
      - Returnează detaliile utilizatorului dacă autentificarea este reușită
    */
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

  /*
  SAVE RECOVERY TOKEN - salvare token de recuperare
    - Salvează token-ul de recuperare și timpul de expirare pentru un utilizator specificat prin email
  */
  async saveRecoveryToken(email, token) {
    return pool.query(
      `
      UPDATE ${this.TABLE}
      SET recovery_token = $1, recovery_expires = NOW() + INTERVAL '15 minutes'
      WHERE email = $2
      `,
      [token, email]
    );
  },

  /*
  FIND BY RECOVERY TOKEN - găsire după token de recuperare
    - Caută un utilizator în baza de date folosind token-ul de recuperare și verifică dacă token-ul nu a expirat
    - Returnează detaliile utilizatorului dacă token-ul este valid
  */
  async findByRecoveryToken(token) {
    const result = await pool.query(
      `
      SELECT * FROM ${this.TABLE}
      WHERE recovery_token = $1 AND recovery_expires > NOW()
      LIMIT 1
      `,
      [token]
    );
    return result.rows[0] || null;
  },

  /*
  UPDATE PASSWORD - actualizare parolă
    - Actualizează parola unui utilizator specificat prin ID și resetează token-ul de recuperare și timpul de expirare
  */
  async updatePassword(id, newPassword) {
    const hashed = hashPassword(newPassword);

    return pool.query(
      `
      UPDATE ${this.TABLE}
      SET parola_hash = $1, recovery_token = NULL, recovery_expires = NULL
      WHERE id_utilizator = $2
      `,
      [hashed, id]
    );
  },

  /*
    SAVE REFRESH TOKEN - salvare token de reîmprospătare
      - Salvează token-ul de reîmprospătare în baza de date pentru un utilizator specificat
  */
  async saveRefreshToken({ userId, tokenHash, expiresAt }) {
    await pool.query(
      `
      INSERT INTO admin.refresh_tokens (id_utilizator, token_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [userId, tokenHash, expiresAt]
    );
  },

  /*
    REMOVE TOKEN - eliminare token
      - Revocă token-ul de reîmprospătare specificat prin hash și șterge cookie-ul corespunzător
  */
  async removeToken() {
    await pool.query(
      `UPDATE admin.refresh_tokens SET revoked = NOW() WHERE token_hash = $1`,
      [matched.token_hash]
    );

    res.clearCookie("refresh_token", { path: "/api/auth" });
    res.json({ success: true });
  },

  /*
    REVOKE - revocare token
      - Marchează token-ul de reîmprospătare specificat prin hash ca revocat în baza de date
  */
  async revoke(token_hash) {
    await pool.query(`
      UPDATE admin.refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = $1
        AND revoked_at IS NULL
    `, [token_hash]);
  },
  
  /*
    FIND VALID - găsire validă
      - Caută un token de reîmprospătare valid în baza de date folosind hash-ul token-ului
      - Returnează detaliile token-ului dacă este valid și nu a expirat sau nu a fost revocat
  */
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
