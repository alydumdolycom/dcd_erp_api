import { pool } from "../config/db.js";
import { sha1 } from "../utils/hash.js";

export async function checkUser(utilizator, parola) {
  const hashed = sha1(parola);

  const result = await pool.query(
    `SELECT * FROM admin.utilizatori 
     WHERE utilizator = $1 AND parola = $2 AND activ = true LIMIT 1`,
    [utilizator, hashed]
  );

  return result.rows[0] || null;
}
