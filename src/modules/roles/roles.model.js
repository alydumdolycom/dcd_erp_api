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
  },

  async userRoles(userId) {
    const { rows } = await pool.query(
        `SELECT r.* FROM permisiuni.roluri r
         JOIN permisiuni.utilizatori_roluri ur ON r.id_rol = ur.rol_id 
          WHERE ur.utilizator_id = $1`,
        [userId]
    );
    return rows;
  },

  async getByUser(userId) {
    const { rows } = await pool.query(`
      SELECT r.id_rol, r.nume_rol
      FROM permisiuni.roluri r
      JOIN permisiuni.utilizatori_roluri ur ON ur.id_rol = r.id_rol
	    JOIN admin.utilizatori u ON u.id_utilizator = ur.id_utilizator
		WHERE ur.id_utilizator = $1
    `, [userId]);

    return rows;
  },

  async getRoles(userId) {
    const { rows } = await pool.query(`
      SELECT r.id_rol, r.nume_rol
      FROM permisiuni.roluri r
      JOIN permisiuni.utilizatori_roluri ur ON ur.id_rol = r.id_rol
      WHERE ur.id_utilizator = $1
    `, [userId]); 
    return rows;
  },
  
  async syncRoles(id, roles) {
    // First, delete existing roles
    await pool.query(
      `DELETE FROM admin.utilizatori_roles WHERE id_utilizator = $1`,
      [id]
    );

    // Then, insert new roles
    for (const roleId of roles) { 
      await pool.query(
        `INSERT INTO admin.utilizatori_roles (id_utilizator, id_rol) VALUES ($1, $2)`,
        [id, roleId]
      );
    }

    return await this.findById(id);
  }
};