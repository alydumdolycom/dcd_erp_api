import pool from "../../config/db.js";

 // adjust schema/table if needed

export const RoleModel = {
  TABLE: "admin.roluri",
  async all() {
    const { rows } = await pool.query(
        `SELECT * FROM ${this.TABLE} ORDER BY id_rol DESC`   
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM ${this.TABLE} WHERE id_rol = $1 LIMIT 1`,
        [id]
    );
    return rows[0] || null;
  },

  async create(roleData) {  
    const { nume, descriere } = roleData;
    const { rows } = await pool.query(
        `INSERT INTO ${this.TABLE} (nume, descriere)
         VALUES ($1, $2)    
            RETURNING *`,
        [nume, descriere]
    );
    return rows[0];
  },

  async update(id, roleData) {
    const { nume, descriere } = roleData;
    const { rows } = await pool.query(
        `UPDATE ${this.TABLE}
         SET nume = $1, descriere = $2
         WHERE id_rol = $3
            RETURNING *`,
        [nume, descriere, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query(
        `DELETE FROM ${this.TABLE} WHERE id_rol = $1 RETURNING *`,
        [id]
    );
    return rows[0];
  }
};