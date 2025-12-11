import  pool from "../config/db.js";
import { sha1 } from "../utils/hash.js";

export async function getUsers(page = 1, limit = 10, filters = {}) {
  const values = [];
  const conditions = [];
  let index = 1;

  const offset = (page - 1) * limit;

  // Build WHERE clause
  if (filters.nume_complet) {
    conditions.push(`nume_complet ILIKE $${index}`);
    values.push(`%${filters.nume_complet}%`);
    index++;
  }

  if (filters.email) {
    conditions.push(`email ILIKE $${index}`);
    values.push(`%${filters.email}%`);
    index++;
  }

  if (filters.activ !== undefined) {
    conditions.push(`activ = $${index}`);
    values.push(filters.activ);
    index++;
  }

  const whereClause = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  // 1️⃣ Count total rows
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM admin.utilizatori
    ${whereClause}
  `;

  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].total, 10);

  // 2️⃣ Paginated SELECT
  const dataQuery = `
    SELECT id_utilizator, nume_complet, email, activ
    FROM admin.utilizatori
    ${whereClause}
    ORDER BY id_utilizator ASC
    LIMIT $${index} OFFSET $${index + 1}
  `;

  const dataValues = [...values, limit, offset];

  const result = await pool.query(dataQuery, dataValues);

  // Final return
  return {
    data: result.rows,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function checkUser(nume_complet, parola_hash) {
  const hashed = sha1(parola_hash);

  const result = await pool.query(
    `SELECT id_utilizator, nume_complet, email FROM admin.utilizatori 
     WHERE nume_complet = $1 AND parola_hash = $2 AND activ = true LIMIT 1`,
    [nume_complet, hashed]
  );

  return result.rows[0] || null;
}

export async function updateUser(id, nume_complet, email, parola_hash, activ) {
  const fields = [];
  const values = [];
  let index = 1;  
  if (nume_complet !== undefined) {
    fields.push(`nume_complet = $${index++}`);
    values.push(nume_complet);
  } 
  if (email !== undefined) {
    fields.push(`email = $${index++}`);
    values.push(email);
  } 
  if (parola_hash !== undefined) {
    fields.push(`parola_hash = $${index++}`);
    values.push(sha1(parola_hash));
  } 
  if (activ !== undefined) {
    fields.push(`activ = $${index++}`);
    values.push(activ);
  }
  if (fields.length === 0) {
    throw new Error("No fields to update");
  } 
  values.push(id);

  const query = `
    UPDATE admin.utilizatori
    SET ${fields.join(", ")}
    WHERE id_utilizator = $${index}
    RETURNING id_utilizator, nume_complet, email, activ
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
}
export async function find(id) {
  const result = await pool.query(
    `SELECT id_utilizator, nume_complet, email, activ, sters_la, data_sters` +
    ` FROM admin.utilizatori WHERE id_utilizator = $1`,
    [id]);
  return result;
}

export async function deleteUser(id) {
  const currentTimestamp = new Date();
  const result = await pool.query(
    `UPDATE admin.utilizatori
     SET activ = FALSE, sters_la = $1
     WHERE id_utilizator = $2`,
    [currentTimestamp, id]
  );
  return result.rows[0] || null;
}