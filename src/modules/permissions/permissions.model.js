import pool from "../../config/db.js";

/* Permission Model */
export const PermissionModel = {

  /* Get all permissions */
  async getAll() {
    const { rows } = await pool.query(`
      SELECT * FROM permisiuni.permisiuni ORDER BY id ASC 
    `);
    return rows;
  },    

  /* Get permissions by role IDs */
  async getByRoleIds(id_utilizator) {
    if (!id_utilizator) return [];

    const values = [id_utilizator];

    const { rows } = await pool.query(`
      SELECT p.*
      FROM permisiuni.permisiuni p
      JOIN permisiuni.roluri_permisiuni rp ON rp.id_permisiune = p.id
      JOIN permisiuni.utilizatori_roluri ur ON ur.id_rol = rp.id_rol
      JOIN admin.utilizatori u ON u.id_utilizator = ur.id_utilizator
      WHERE u.id_utilizator = $1
    `, values);
    return rows;
  },

  /* Get permissions by user ID */
  async getByUserId(id_utilizator) {
    if (!id_utilizator) return [];  
    const values = [id_utilizator];

    const { rows } = await pool.query(`
      SELECT p.*
      FROM permisiuni.permisiuni p  
      JOIN permisiuni.utilizatori_permisiuni up ON up.id_permisiune = p.id
      JOIN admin.utilizatori u ON u.id_utilizator = up.id_utilizator
      WHERE u.id_utilizator = $1  
    `, values);
    return rows;
  },

  /* Create a new permission */
  async create(data) {
    const values = [data.nume, data.descriere];
    const { rows } = await pool.query(
      `INSERT INTO permisiuni.permisiuni (nume, descriere) VALUES ($1, $2) RETURNING *`,
      values
    );
    return rows[0];
  },

  /* Get permission by ID */
  async getById(id) {
    const values = [id];
    const { rows } = await pool.query(
      `SELECT * FROM permisiuni.permisiuni WHERE id = $1`,
      values
    );
    return rows[0];
  },

  /* Update permission by ID */
  async update(id, data) {
    const values = [data.nume, data.descriere, id];
    const { rows } = await pool.query(
      `UPDATE permisiuni.permisiuni SET nume = $1, descriere = $2 WHERE id = $3 RETURNING *`,
      values
    );
    return rows[0];
  },

  /* Delete permission by ID */
  async delete(id) {
    const values = [id];
    await pool.query(
      `DELETE FROM permisiuni.permisiuni WHERE id = $1`,
      values
    );
  },

  /* Get permissions for a specific role */
  async getRolePermissions(id_rol) {
    const values = [id_rol];
    const { rows } = await pool.query(`
      SELECT p.*
      FROM permisiuni.permisiuni p
      JOIN permisiuni.roluri_permisiuni rp ON rp.id_permisiune = p.id
      WHERE rp.id_rol = $1
    `, values);
    return rows;
  }
};