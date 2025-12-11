// models/role.model.js
import pool from "../config/db.js";

export const Employee = {
  table: "admin.personal",

  findById: async (id) => {
    return (await db.query(
      "SELECT * FROM `${table}` WHERE id_salariati = $1",
      [id]
    )).rows[0];
  }
}