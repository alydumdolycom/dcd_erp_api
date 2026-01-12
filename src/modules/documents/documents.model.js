import pool from "../../config/db.js";

export const DocumentsModel = {
    Table: "salarizare.acte_aditionale",
    // Define your document schema and methods here
    async all(id_firma) {
        const query = `
                SELECT * FROM ${this.Table}
                LEFT JOIN salarizare.salariati 
                ON salarizare.salariati.id = ${this.Table}.id_salariat
                WHERE salarizare.salariati.id_firma = $1`;
        const values = [id_firma];
        const { rows } = await pool.query(query, values);
        return rows || null;
    },

    async create(data) {
        try {
            const values = [
                data.id_salariat,
                data.salariu_vechi,
                data.salariu_baza,
                data.spor_vechime,
                data.spor_repaus,
                data.spor_noapte,
                data.data_incepere,
                data.data_act,
                data.numar_act,
                data.data_incetare,
                data.data_operare,
                data.operat_de
            ];

            const query = `
                INSERT INTO ${this.Table} 
                (id_salariat, salariu_vechi, salariu_baza, spor_vechime, spor_repaus, spor_noapte, data_incepere, data_act, numar_act, data_incetare, data_operare, operat_de) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;

            const rows = await pool.query(query, values);
            return rows;

        } catch (error) {
            throw error;
        }
    },

    async findById(id) {
        const rows = await pool.query(`
            SELECT * FROM ${this.Table}
            LEFT JOIN salarizare.salariati 
                ON salarizare.salariati.id = ${this.Table}.salariat_id
            WHERE ${this.Table}.id = ?
        `, [id]);
        return rows[0];
    },

    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const key in data) {
            fields.push(`${key} = $${idx}`);
            values.push(data[key]);
            idx++;
        }
        values.push(id); // for WHERE clause

        const query = `
            UPDATE ${this.Table}
            SET ${fields.join(", ")}
            WHERE id = $${idx}
            RETURNING *;
        `;
        const result = await pool.query(query, values);
        
        return result.rows[0];
    },

    async delete(id) {
        await pool.query(`
            DELETE FROM ${this.Table} WHERE ${this.Table}.id = $1
        `, [id]);
    }
};