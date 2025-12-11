// models/role.model.js
import pool from "../config/db.js";

export const User = {
  table: "admin.utilizatori",

  findById: async (id) => {
    return (await db.query(
      "SELECT * FROM `${table}` WHERE id_utilizator = $1",
      [id]
    )).rows[0];
  }
}