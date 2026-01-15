import pool from "../../config/db.js";

export const DepartmentsModel = {
  TABLE: "nomenclatoare.nom_salarii_departamente",

  async all() {
    const query = `
      SELECT    
        id,
        nume_departament, 
        observatii
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
    // Build dynamic SET clause for PATCH-like updates
    const fields = [];
    const values = [];
    let idx = 1;

    if (nume_departament !== undefined) {
      fields.push(`nume_departament = $${idx++}`);
      values.push(nume_departament);
    }
    if (observatii !== undefined) {
      fields.push(`observatii = $${idx++}`);
      values.push(observatii);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE ${this.TABLE}
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;
    values.push(id);
    const { rows } = await pool.query(query, values);
    return rows[0];
  }, 
   
  async findById(id) {
    const query = `
      SELECT    
        id,
        nume_departament, 
        observatii
      FROM ${this.TABLE}
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;;  
  },

  async findOne({ nume_departament }) {
    const query = `
      SELECT    
        id,
        nume_departament, 
        observatii
      FROM ${this.TABLE}
      WHERE nume_departament = $1
    `;
    const { rows } = await pool.query(query, [nume_departament]);
    return rows[0] || null;
  },

  async delete(id) {
    const query = `
      DELETE FROM ${this.TABLE}
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}