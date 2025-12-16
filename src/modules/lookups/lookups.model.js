import pool from "../../config/db.js";

export const LookupsModel = {
  async getDepartments() {
    const { rows } = await pool.query(
      `SELECT id, nume_departament FROM admin.nom_salarii_departamente ORDER BY nume_departament`
    );
    return rows;
  },

  async getCities(countyId) {
    let sql = `SELECT id, judet FROM admin.nom_judete`;
    const params = [];

    if (countyId) {
      params.push(countyId);
      sql += ` WHERE id = $1`;
    }

    sql += ` ORDER BY judet`;

    const { rows } = await pool.query(sql, params);
    return rows;
  },

  async getTowns(cityId) {
    let sql = `SELECT id, name FROM admin.towns`;
    const params = [];

    if (cityId) {
      params.push(cityId);
      sql += ` WHERE city_id = $1`;
    }

    sql += ` ORDER BY name`;

    const { rows } = await pool.query(sql, params);
    return rows;
  },
  async getJobTypes() {
    const { rows } = await pool.query(
      `SELECT id, nume_functie FROM admin.nom_salarii_functii ORDER BY nume_functie`
    );
    return rows;
  } 
};
