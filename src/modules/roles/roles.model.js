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
  async findRole(nume_rol) {
    const { rows } = await pool.query(
        `SELECT nume_rol FROM admin.roluri WHERE nume_rol = $1 LIMIT 1`,
        [nume_rol]
    );
    return rows[0] || null;
  },
  async findById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM ${this.TABLE} WHERE id_rol = $1 LIMIT 1`,
        [id]
    );
    return rows[0] || null;
  },

  async create(roleData) {  
    const { nume_rol, descriere } = roleData;
    const { rows } = await pool.query(
        `INSERT INTO ${this.TABLE} (nume_rol, descriere)
         VALUES ($1, $2)    
            RETURNING *`,
        [nume_rol, descriere]
    );
    return rows[0];
  },

  async update(id, roleData) {
    const { nume_rol, descriere } = roleData;
    const { rows } = await pool.query(
        `UPDATE ${this.TABLE}
         SET nume_rol = $1, descriere = $2
         WHERE id_rol = $3
            RETURNING *`,
        [nume_rol, descriere, id]
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