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

  async update(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    // Only handle permissions if data.permissions is provided
    if (Array.isArray(data.permissions)) {
      // Normalize permissions to integers and remove duplicates
      const newPerms = Array.from(new Set(data.permissions.map(Number)));

      // Fetch current permissions for the role
      const { rows: currentPerms } = await pool.query(
      `SELECT id_permisiune FROM permisiuni.roluri_permisiuni WHERE id_rol = $1`,
      [id]
      );
      const currentPermIds = currentPerms.map(row => Number(row.id_permisiune));

      // Permissions to add: in newPerms but not in currentPermIds
      const permsToAdd = newPerms.filter(permId => !currentPermIds.includes(permId));
      // Permissions to remove: in currentPermIds but not in newPerms
      const permsToRemove = currentPermIds.filter(permId => !newPerms.includes(permId));

      // Add new permissions
      if (permsToAdd.length > 0) {
      const insertValues = permsToAdd.map(permId => `(${id}, ${permId})`).join(", ");
      await pool.query(
        `INSERT INTO permisiuni.roluri_permisiuni (id_rol, id_permisiune)
         VALUES ${insertValues}
         ON CONFLICT DO NOTHING`
      );
      }

      // Remove permissions not present in newPerms
      if (permsToRemove.length > 0) {
      await pool.query(
        `DELETE FROM permisiuni.roluri_permisiuni
         WHERE id_rol = $1 AND id_permisiune = ANY($2::int[])`,
        [id, permsToRemove]
      );
      }
    }

    if (data.nume_rol !== undefined) {
      fields.push(`nume_rol = $${index++}`);
      values.push(data.nume_rol);
    }

    if (data.descriere !== undefined) {
      fields.push(`descriere = $${index++}`);
      values.push(data.descriere);
    }

    let updatedRole = null;
    if (fields.length > 0) {
      values.push(id);
      const query = `
      UPDATE ${this.TABLE}
      SET ${fields.join(", ")}
      WHERE id_rol = $${index}
      RETURNING *;
      `;
      const { rows } = await pool.query(query, values);
      updatedRole = rows[0];
    } else {
      // If no fields to update, just fetch the current role
      updatedRole = await this.findById(id);
    }

    // Fetch all permissions for this role
    const { rows: permissions } = await pool.query(
      `SELECT p.* FROM permisiuni.permisiuni p
       INNER JOIN permisiuni.roluri_permisiuni rp ON p.id = rp.id_permisiune
       WHERE rp.id_rol = $1`,
      [id]
    );
    return { ...updatedRole, permissions };
  },

  async delete(id) {
    const { rows } = await pool.query(
        `DELETE FROM ${this.TABLE} WHERE id_rol = $1 RETURNING *`,
        [id]
    );
    return rows[0];
  }
};