import pool from "../../config/db.js";

export const DepartmentsModel = {
  TABLE: "nomenclatoare.nom_salarii_departamente",
    async all() {
    const query = `
      SELECT    
        id,
        nume_departament
      FROM ${this.TABLE}
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },
  async create({ nume_departament, observatii }) {
    const query = `
      INSERT INTO ${this.TABLE} (nume_departament, observatii)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [nume_departament, observatii];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id, { nume_departament, observatii }) {
    const query = `
      UPDATE ${this.TABLE}
      SET nume_departament = $1, observatii = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [nume_departament, observatii, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },  async findById(id) {
    const query = `
      SELECT
        id,
        nume_department
      FROM ${this.TABLE}
        WHERE id = $1
        LIMIT 1;
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }
}