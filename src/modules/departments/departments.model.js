import pool from "../../config/db.js";

export const DepartmentsModel = {
  TABLE: "nom_salarii_departamente",
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
  async create({ nume_departament }) {
    const query = `
      INSERT INTO ${this.TABLE} (nume_departament)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [nume_departament];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id, { nume_departament }) {
    const query = `
      UPDATE ${this.TABLE}
      SET nume_departament = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [nume_departament, id];
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