import pool from "../../config/db.js";

 // adjust schema/table if needed

export const RoleModel = {
  TABLE: "permisiuni.roluri",
  async all() {
    const { rows } = await pool.query(
        `SELECT * FROM ${this.TABLE}`   
    );
    return rows;
  },

  async findRole(nume_rol) {
    const { rows } = await pool.query(
        `SELECT nume_rol FROM ${this.TABLE} WHERE nume_rol = $1 LIMIT 1`,
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
    const fields = [];
    const values = [];
    let index = 1;

    if (roleData.nume_rol !== undefined) {
      fields.push(`nume_rol = $${index++}`);
      values.push(roleData.nume_rol);
    }

    if (roleData.descriere !== undefined) {
      fields.push(`descriere = $${index++}`);
      values.push(roleData.descriere);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const query = `
      UPDATE ${this.TABLE}
      SET ${fields.join(", ")}
      WHERE id_rol = $${index}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
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