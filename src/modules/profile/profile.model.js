import pool from "../../config/db.js";
import { hashPassword } from "../../utils/hash.js";

export const ProfileModel = {
  TABLE: "admin.utilizatori",
  async findById(id_utilizator) {       
    const { rows } = await pool.query(
        `SELECT  U.id_utilizator, U.nume_complet, U.email, U.activ  FROM ${this.TABLE} U
         WHERE U.id_utilizator = $1 Limit 1`,
        [id_utilizator]
    );
    return rows[0] || null;
  },

  async update(id_utilizator, profileData) {  
    // Destructure fields from profileData
    const { email, nume_complet, parola_hash } = profileData;

    // Prepare fields to update
    const fields = [];
    const values = [];
    let idx = 1;

    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (nume_complet !== undefined) {
      fields.push(`nume_complet = $${idx++}`);
      values.push(nume_complet);
    }
    if (parola_hash !== undefined) {
      fields.push(`parola_hash = $${idx++}`);
      const hashedPassword = await hashPassword(parola_hash);
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return false; // Nothing to update
    }

    values.push(id_utilizator);

    const query = `
      UPDATE ${this.TABLE}
      SET ${fields.join(', ')}
      WHERE id_utilizator = $${idx}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
}