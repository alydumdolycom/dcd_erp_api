import pool from "../../config/db.js";

export const LookupsModel = {
  async getDepartments() {
    const { rows } = await pool.query(
      `SELECT id, nume_departament FROM admin.nom_salarii_departamente ORDER BY nume_departament`
    );
    return rows;
  },

  async getCities() {
    let sql = `SELECT id, judet FROM admin.nom_judete`;
    const { rows } = await pool.query(sql);
    return rows;
  },

  async getTowns(id) {
    const sql = `
      SELECT id, localitate FROM admin.nom_localitati
      WHERE id_judet = $1
    `;

    const { rows } = await pool.query(sql, [id]);
    return rows;
  },

  async getJobTypes() {
    const { rows } = await pool.query(
      `SELECT id, nume_functie FROM admin.nom_salarii_functii ORDER BY nume_functie`
    );
    return rows;
  } 
};
