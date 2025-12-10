import pool from "../config/db.js";
import { sha1 } from "../utils/hash.js";

export async function registerUser(utilizator, parola) {
  try {
    // Check if user exists by username
    const check = await pool.query(
      `SELECT id, email FROM admin.utilizatori WHERE email = $1 LIMIT 1`,
      [utilizator]
    );

    if (check.rows.length > 0) {
      return { success: false, message: "User already exists" };
    }

    // Hash password (SHA1)
    const hashedPassword = sha1(parola);

    // Insert user into DB
    await pool.query(
      `INSERT INTO admin.utilizatori (email, utilizator, parola, activ)
       VALUES ($1, $2, $3, true)`,
      [email, utilizator, hashedPassword]
    );

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Registration failed" };
  }
}
