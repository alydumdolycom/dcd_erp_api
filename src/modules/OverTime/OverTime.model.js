import pool from "../../config/db.js";

export const OverTimeModel = {
    Table: "salarizare.ore_suplimentare",
    async all(id_firma) {
        const query = `SELECT 
                S.id AS id_salariat,
                S.nume,
                S.prenume,
                OS.ore_lucrate,
                OS.data_ora_inceput,
                OS.co,
                OS.ore_cm
                FROM ${this.Table} AS OS
                LEFT JOIN salarizare.salariati S 
                    ON ${this.Table}.id_salariat = S.id
                WHERE S.id_firma = $1`;
        const { rows } = await pool.query(query, [id_firma]);
        return rows;
    },

    async getById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${this.Table} WHERE id = $1`, [id]);
        return rows[0];
    },

    async create(data) {    
        const { id_firma, id_salariat, data_ora_inceput, data_ora_sfarsit, motiv } = data;
        const { rows } = await pool.query(
            `INSERT INTO ${this.Table} (id_firma, id_salariat, data_ora_inceput, data_ora_sfarsit, motiv) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_firma, id_salariat, data_ora_inceput, data_ora_sfarsit, motiv]
        );
        return rows[0];
    },

    async update(id, data) {    
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (data.id_firma !== undefined) {
            updates.push(`id_firma = $${paramIndex++}`);
            values.push(data.id_firma);
        }
        if (data.id_salariat !== undefined) {
            updates.push(`id_salariat = $${paramIndex++}`);
            values.push(data.id_salariat);
        }
        if (data.data_ora_inceput !== undefined) {
            updates.push(`data_ora_inceput = $${paramIndex++}`);
            values.push(data.data_ora_inceput);
        }
        if (data.data_ora_sfarsit !== undefined) {
            updates.push(`data_ora_sfarsit = $${paramIndex++}`);
            values.push(data.data_ora_sfarsit);
        }
        if (data.motiv !== undefined) {
            updates.push(`motiv = $${paramIndex++}`);
            values.push(data.motiv);
        }

        if (updates.length === 0) return null;

        values.push(id);
        const { rows } = await pool.query(
            `UPDATE ${this.Table} SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        return rows[0];
    },

    async delete(id) {
        const result = await pool.query(`DELETE FROM ${this.Table} WHERE id = $1`, [id]);
        return result;
    }
};