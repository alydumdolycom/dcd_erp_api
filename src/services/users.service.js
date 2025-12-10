import  pool from "../config/db.js";
import { sha1 } from "../utils/hash.js";

export async function checkUser(nume_complet, parola_hash) {
  const hashed = sha1(parola_hash);

  const result = await pool.query(
    `SELECT id FROM admin.utilizatori 
     WHERE nume_complet = $1 AND parola_hash = $2 AND activ = true LIMIT 1`,
    [utilizator, hashed]
  );

  return result.rows[0] || null;
}
