import pool from "../../config/db.js";

export const LookupsModel = {

  async getContractType() {
    const query = `
      SELECT NST.* FROM nomenclatoare.nom_salarii_tipcontract AS NST
    `;
    return await pool.query(query)
  },



  async getDepartments() {
    const { rows } = await pool.query(
      `SELECT id, nume_departament FROM nomenclatoare.nom_salarii_departamente ORDER BY nume_departament`
    );
    return rows;
  },

  async insertDepartment(departmentData) {
    const { nume_departament, observatii } = departmentData;
    const query = `
      INSERT INTO nomenclatoare.nom_salarii_departamente (nume_departament, observatii)
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [nume_departament, observatii];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getCities() {
    let sql = `SELECT id, judet FROM nomenclatoare.nom_judete`;
    const { rows } = await pool.query(sql);
    return rows;
  },

  async getTowns(id) {
    const sql = `
      SELECT id, localitate FROM nomenclatoare.nom_localitati
      WHERE id_judet = $1
    `;

    const { rows } = await pool.query(sql, [id]);
    return rows;
  },

  async getJobTypes() {
    const { rows } = await pool.query(
      `SELECT id, nume_functie FROM nomenclatoare.nom_salarii_functii ORDER BY nume_functie`
    );
    return rows;
  },

  async saveJobTypes(jobTypesData) {
    const { id, nume_functie, observatii, cod_cor, functie_cor } = jobTypesData;
    let query, values;
    if (id) {
      query = `
        UPDATE nomenclatoare.nom_salarii_functii
        SET nume_functie = $2, observatii = $3
        WHERE id = $1
        RETURNING *;
      `;
      values = [id, nume_functie, observatii, cod_cor, functie_cor];
    } else {
      query = `
        INSERT INTO nomenclatoare.nom_salarii_functii (nume_functie, observatii, cod_cor, functie_cor)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      values = [nume_functie, observatii, cod_cor, functie_cor];
    }
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async countEmployees(companyId) {
    const query = `
      SELECT COUNT(*) AS count FROM salarizare.salariati WHERE id_firma = $1
    `;
    const { rows } = await pool.query(query, [companyId]);
    return parseInt(rows[0].count, 10);
  },
  async countUsers() {
    const query = `
      SELECT COUNT(*) AS count FROM admin.utilizatori
    `;
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count);
  },
  async countRoles() {
    const query = `
      SELECT COUNT(*) AS count FROM admin.roluri
    `;
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count);
  }
};
