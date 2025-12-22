import pool from "../../config/db.js";

export const LookupsModel = {

  async getContractType() {
    const query = `
      SELECT NST.* FROM nom_salarii_tipcontract AS NST
    `;
    return await pool.query(query)
  },

  async getEmployeeCompany(id) {
    const query = `
      SELECT F.id, F.nume FROM utilizatori AS U
      JOIN utilizatori_acces_firme as UAF 
        ON U.id_utilizator = UAF.id_utilizator
      JOIN firme AS F
        ON F.id = UAF.id_firma
      WHERE U.id_utilizator = $1
    `;
    const values = [id];
    return await pool.query(query, values);
  },
  
  async updateEmployeeMode(id, mode) {
    const query = `
      UPDATE salarizare.salariati
      SET
        mod_editare = $2
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, mode];
    return await pool.query(query, values);
  },

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
