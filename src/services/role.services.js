import pool from "../config/db.js";

export async function checkRole(id_rol) {
  try {
    // 1️⃣ Check if role exists
    const roleResult = await pool.query(
      `SELECT id_rol, nume_rol FROM admin.roluri WHERE id_rol = $1`,
      [id_rol]
    );

    if (roleResult.rows.length === 0) {
      return {
        success: false,
        message: "Rolul nu există",
        code: "ROLE_NOT_FOUND"
      };
    }

    const role = roleResult.rows[0];

    // 2️⃣ Check if role is assigned to any user
    const userResult = await pool.query(
      `SELECT COUNT(*) AS count 
       FROM admin.utilizatori 
       WHERE id_rol = $1`,
      [id_rol]
    );

    const userCount = Number(userResult.rows[0].count);

    if (userCount > 0) {
      return {
        success: false,
        message: `Rolul "${role.nume_rol}" este folosit de ${userCount} utilizatori.`,
        code: "ROLE_IN_USE_USERS"
      };
    }

    // 3️⃣ Check if role has permissions in roluri_accese
    const acceseResult = await pool.query(
      `SELECT COUNT(*) AS count 
       FROM admin.roluri_accese 
       WHERE id_rol = $1`,
      [id_rol]
    );

    const permCount = Number(acceseResult.rows[0].count);

    if (permCount > 0) {
      return {
        success: false,
        message: `Rolul "${role.nume_rol}" are permisiuni asociate și nu poate fi șters.`,
        code: "ROLE_IN_USE_PERMISSIONS"
      };
    }

    // 4️⃣ Safe to delete
    return {
      success: true,
      message: `Rolul "${role.nume_rol}" poate fi șters.`,
      code: "ROLE_CAN_BE_DELETED"
    };

  } catch (error) {
    console.error("checkRole error:", error);
    return {
      success: false,
      message: "Eroare la verificarea rolului",
      code: "SERVER_ERROR",
      error: error.message
    };
  }
}
