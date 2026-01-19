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
    // Fetch the role by id
    const { rows } = await pool.query(
      `SELECT * FROM ${this.TABLE} WHERE id_rol = $1 LIMIT 1`,
      [id]
    );
    const role = rows[0];
    if (!role) return null;

    // Fetch permissions associated with this role
    const { rows: permissions } = await pool.query(
      `SELECT p.* FROM permisiuni.permisiuni p
       INNER JOIN permisiuni.roluri_permisiuni rp ON p.id = rp.id_permisiune
       WHERE rp.id_rol = $1`,
      [id]
    );

    // Return role with permissions array
    return { ...role, permissions };
    return rows[0] || null;
  },

  async create(roleData) {  
    const { nume_rol, descriere, permissions } = roleData;
    // Insert the role
    const { rows } = await pool.query(
      `INSERT INTO ${this.TABLE} (nume_rol, descriere)
       VALUES ($1, $2)
       RETURNING *`,
      [nume_rol, descriere]
    );
    const role = rows[0];

    // Insert permissions if provided and is an array
    if (Array.isArray(permissions) && permissions.length > 0) {
      const permValues = permissions
      .map(permId => `(${role.id_rol}, ${Number(permId)})`)
      .join(", ");
      await pool.query(
      `INSERT INTO permisiuni.roluri_permisiuni (id_rol, id_permisiune)
       VALUES ${permValues}
       ON CONFLICT DO NOTHING`
      );
    }

    // Fetch all permissions for this role
    const { rows: perms } = await pool.query(
      `SELECT p.* FROM permisiuni.permisiuni p
       INNER JOIN permisiuni.roluri_permisiuni rp ON p.id = rp.id_permisiune
       WHERE rp.id_rol = $1`,
      [role.id_rol]
    );

    return { ...role, permissions: perms };
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
  },

  async roleUsed(id) {
    // Check if the role is assigned to any users
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM permisiuni.roluri_permisiuni WHERE id_rol = $1`,
      [id]
    );
    const count = parseInt(rows[0].count, 10);
    return count > 0;
  },

  async getRolePermissions(roleId) {
    const { rows } = await pool.query(
      `SELECT p.* FROM permisiuni.permisiuni p
       INNER JOIN permisiuni.roluri_permisiuni rp ON p.id = rp.id_permisiune  
        WHERE rp.id_rol = $1`,
      [roleId]
    );
    return rows;
  }
};