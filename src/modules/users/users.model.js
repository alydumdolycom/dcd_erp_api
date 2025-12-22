// src/modules/users/users.model.js
import pool from "../../config/db.js";
import { hashPassword } from "../../utils/hash.js";

export const UserModel = {
  TABLE: "admin.utilizatori",
  // Create user
  async create({ nume_complet, email, parola_hash }) {
    parola_hash = await hashPassword(parola_hash);
    const sql = `
      INSERT INTO ${this.TABLE}
        (nume_complet, email, parola_hash)
      VALUES ($1, $2, $3)
      RETURNING id_utilizator, nume_complet, email, activ, creat_la;
    `;

    const result = await pool.query(sql, [
      nume_complet,
      email,
      parola_hash
    ]);

    return result.rows[0];
  },
  async all({ page = 1, limit = 10, search = "", nume_complet, email, activ }) {
    const offset = (page - 1) * limit;

    let filters = [];
    let values = [];
    let whereClauses = [];

    if (search) {
      values.push(`%${search}%`);
      whereClauses.push(`(nume_complet ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }
    if (nume_complet) {
      values.push(nume_complet);
      whereClauses.push(`nume_complet = $${values.length}`);
    }
    if (email) {
      values.push(email);
      whereClauses.push(`email = $${values.length}`);
    }
    if (activ !== undefined) {
      values.push(activ);
      whereClauses.push(`activ = $${values.length}`);
    }
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const dataSQL = `
      SELECT id_utilizator, nume_complet, email, activ, creat_la
      FROM ${this.TABLE}
      ${whereSQL}
      ORDER BY id_utilizator DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2};
    `;
    values.push(limit, offset);

    const countSQL = `
      SELECT COUNT(*) AS total
      FROM ${this.TABLE}
      ${whereSQL};
    `;
    const [dataResult, countResult] = await Promise.all([
      pool.query(dataSQL, values),
      pool.query(countSQL, values.slice(0, values.length - 2))
    ]);
    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total, 10)
      }
    };
  },
  // Check name
  async findByName(nume_complet) {
    const result = await pool.query(
      `SELECT id_utilizator FROM admin.utilizatori 
       WHERE nume_complet = $1 LIMIT 1`,
      [nume_complet]
    );
    return result.rows[0] || null;
  },

  // Check email
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT id_utilizator FROM admin.utilizatori 
       WHERE email = $1 LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  },
  // soft delete user
  async softDelete(id) {
    const res = await pool.query(
      `UPDATE ${this.TABLE} SET activ = false, sters_la = NOW() WHERE id_utilizator = $1 RETURNING id_utilizator, activ, sters_la`,
      [id]
    );
    return res.rows[0] || null;
  },
  // find user
  async findByUser({ nume_complet, parola_hash }) {
    const sql = `
      SELECT *
      FROM admin.utilizatori
      WHERE nume_complet = $1
      LIMIT 1;
    `;
    const result = await pool.query(sql, nume_complet);
    if (result.rows.length === 0) {
      return null;
    }

    if(result.rows[0].parola_hash !== sha1(parola_hash)){
      return null;
    }

    const user = result.rows[0];

    // User exists but inactive
    if (!user.activ) {
      return { error: true, message: "Utilizator inactiv." };
    }

    return user;
  },
  // update user
  async update(id, { nume_complet, email, parola_hash, activ, id_rol }) {
    const fields = [];
    const values = [];
    let idx = 1;  
  
    if (nume_complet !== undefined) {
      fields.push(`nume_complet = $${idx++}`);
      values.push(nume_complet);
    } 

    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }

    if (parola_hash !== undefined) {
      fields.push(`parola_hash = $${idx++}`);
      parola_hash = await hashPassword(parola_hash);
      values.push(parola_hash);
    }

    if (activ !== undefined) {
      fields.push(`activ = $${idx++}`);
      values.push(activ);
    }

    if (id_rol !== undefined) {
      fields.push(`id_rol = $${idx++}`);
      values.push(id_rol);
    }

    if (fields.length === 0) {
      return null; // Nothing to update
    }

    values.push(id);
    const sql = `
      UPDATE ${this.TABLE}
      SET ${fields.join(", ")}
      WHERE id_utilizator = $${idx}
      RETURNING id_utilizator, nume_complet, email, activ, creat_la;
    `;

    const result = await pool.query(sql, values);
    return result.rows[0];
  }
};
