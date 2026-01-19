// src/modules/users/users.model.js
import pool from "../../config/db.js";
import { hashPassword } from "../../utils/hash.js";

export const UserModel = {
  TABLE: "admin.utilizatori",

  async all(data) {
    let idx = 1;
    let whereClauses = [];
    let values = [];
    const { nume_complet, email, activ, search } = data || {};

    if(search) {
      whereClauses.push(`(salarizare.nume_complet ILIKE '%' || $${idx} || '%' OR salarizare.email ILIKE '%' || $${idx} || '%')`);
      values.push(search);
      idx++;
    }

    const query = `
      SELECT id_utilizator, nume_complet, email, activ, creat_la
      FROM ${this.TABLE}
      ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
      ORDER BY id_utilizator DESC;
    `;

    const { rows } = await pool.query(query, values);
    return rows;
  },

  // Create user
  async create(data) {
    const { nume_complet, email, parola_hash, roles } = data;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user
      const userSql = `
        INSERT INTO ${this.TABLE}
          (nume_complet, email, parola_hash)
        VALUES ($1, $2, $3)
        RETURNING id_utilizator, nume_complet, email, activ, creat_la;
        `;
      const userResult = await client.query(userSql, [
      nume_complet,
      email,
      await hashPassword(parola_hash)
      ]);
      const user = userResult.rows[0];
      const userId = user.id_utilizator;

      // Insert roles if provided
      if (Array.isArray(roles)) {
        for (const roleId of roles) {
          // Check if role exists
          const { rowCount } = await client.query(
            `SELECT R.id_rol FROM permisiuni.roluri as R WHERE id_rol = $1 LIMIT 1`,
            [roleId]
              );
          if (rowCount > 0) {
            await client.query(
              `INSERT INTO permisiuni.utilizatori_roluri (id_utilizator, id_rol) VALUES ($1, $2)`,
              [userId, roleId]
            );
          } else {
            return false;
          }
        }
      }

      await client.query('COMMIT');
      return user;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // Check name
  async findByName(nume_complet) {
    const result = await pool.query(
      `SELECT id_utilizator FROM admin.utilizatori 
        WHERE nume_complet = $1 LIMIT 1`,
      [nume_complet]
    );
    return result.rows[0] || null;
  },

  // Check email
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT id_utilizator FROM admin.utilizatori 
        WHERE email = $1 LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  },

  // soft delete user
  async softDelete(id) {
    const res = await pool.query(
      `UPDATE ${this.TABLE} SET activ = false, sters_la = NOW() WHERE id_utilizator = $1 RETURNING id_utilizator, activ, sters_la`,
      [id]
    );
    return res.rows[0] || null;
  },

  // find user
  async findByUser({ nume_complet, parola_hash }) {
    const sql = `
      SELECT *
      FROM admin.utilizatori
      WHERE nume_complet = $1
      LIMIT 1;
    `;
    const result = await pool.query(sql, nume_complet);
    if (result.rows.length === 0) {
      return null;
    }

    if(result.rows[0].parola_hash !== sha1(parola_hash)){
      return null;
    }

    const user = result.rows[0];

    // User exists but inactive
    if (!user.activ) {
      return { error: true, message: "Utilizator inactiv." };
    }

    return user;
  },

  // update user
  async update(id, data) {
    let { nume_complet, email, parola_hash, activ, roles } = data;
    const fields = [];
    const values = [];
    let idx = 1;  

    if (nume_complet !== undefined) {
      fields.push(`nume_complet = $${idx++}`);
      values.push(nume_complet);
    } 

    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }

    if (parola_hash !== undefined) {
      fields.push(`parola_hash = $${idx++}`);
      parola_hash = await hashPassword(parola_hash);
      values.push(parola_hash);
    }

    if (activ !== undefined) {
      fields.push(`activ = $${idx++}`);
      values.push(activ);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      values.push(id);
      if(fields.length > 0) { 

        const query = `
          UPDATE ${this.TABLE}
          SET ${fields.join(", ")}
          WHERE id_utilizator = $${idx}
          RETURNING id_utilizator, nume_complet, email, activ, creat_la;
        `;
        const data =  await client.query(query, values);
      } else {
        const data = await this.findById(id);
      }
      // Handle roles update in transaction
        await client.query(
          `DELETE FROM permisiuni.utilizatori_roluri WHERE id_utilizator = $1`,
          [id]
        );
        for (const roleId of roles) {
          await client.query(
          `INSERT INTO permisiuni.utilizatori_roluri (id_utilizator, id_rol) VALUES ($1, $2)`,
          [id, roleId]
          );
        }

      await client.query('COMMIT');
      return data;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id_utilizator, nume_complet, email, activ, creat_la FROM admin.utilizatori 
        WHERE id_utilizator = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async syncRoles(userId, roles) {
    // First, remove existing roles
    await pool.query(
      `DELETE FROM permisiuni.utilizatori_roluri WHERE id_utilizator = $1`,
      [userId]
    );
    // Then, insert new roles
    const insertPromises = roles.map(roleId => {
      return pool.query(
        `INSERT INTO permisiuni.utilizatori_roluri (id_utilizator, id_rol) VALUES ($1, $2)`,
        [userId, roleId]
      );
    });
    await Promise.all(insertPromises);
    return await this.findById(userId);
  },

  async userRoles(userId) {
    const { rows } = await pool.query(
        `SELECT r.* FROM permisiuni.roluri r
          JOIN permisiuni.utilizatori_roluri ur ON r.id_rol = ur.id_rol 
          WHERE ur.id_utilizator = $1
          ORDER BY r.id_rol ASC;`,
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

  async getPermissions(roleId) {
    const { rows } = await pool.query(` 
        SELECT
          r.id_rol,
          r.nume_rol,
          r.descriere,
          p.name

        FROM admin.utilizatori u
        JOIN permisiuni.utilizatori_roluri ur ON ur.id_utilizator = u.id_utilizator
        JOIN permisiuni.roluri r ON r.id_rol = ur.id_rol
        JOIN permisiuni.roluri_permisiuni rp ON rp.id_rol = r.id_rol
        JOIN permisiuni.permisiuni p ON p.id = rp.id_permisiune

        WHERE r.id_rol = $1
        ORDER BY r.id_rol;
`, 
      [roleId]); 
    return rows;
  },

  async getUserWithAccess(userId) {
    const { rows } = await pool.query(`
      SELECT r.id_rol, r.nume_rol
        FROM permisiuni.roluri r
        JOIN permisiuni.utilizatori_roluri ur ON ur.id_rol = r.id_rol
        JOIN admin.utilizatori u ON u.id_utilizator = ur.id_utilizator
      WHERE ur.id_utilizator = $1;
    `, [userId]);   
    return rows;
  },

  async getUserPermissions(userId) {
    const { rows } = await pool.query(` 
        SELECT U.id_utilizator, P.name FROM permisiuni.utilizatori_permisiuni UP
        LEFT JOIN admin.utilizatori U ON U.id_utilizator = UP.id_utilizator
        LEFT JOIN permisiuni.permisiuni  P ON  P.id = UP.id_permisiune
        WHERE U.id_utilizator = $1;`
      , [userId]); 
    return rows;
  }   
};