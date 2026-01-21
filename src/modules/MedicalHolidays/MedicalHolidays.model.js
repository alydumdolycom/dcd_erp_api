import pool from "../../config/db.js";

export const MedicalHolidaysModel = {
    Table: "salarizare.concedii_medicale",

    async all() {
        const { rows } = await pool.query(
            `SELECT CM.*, S.nume, S.prenume FROM ${this.Table} as CM
             LEFT JOIN salarizare.salariati as S ON CM.id_salariat = S.id`
        );
        return rows;
    },

    async create(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const insertQuery = `
                INSERT INTO ${this.Table} (
                    id_salariat,
                    serie_certificat,
                    numar_certificat,
                    cod_indemnizatie,
                    cod_loc_prescriere,
                    cod_boala,
                    data_acordarii,
                    data_inceput,
                    data_sfarsit,
                    anul,
                    luna
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10,
                    $11
                )
                RETURNING *;
            `;
            const values = [
                data.id_salariat,
                data.serie_certificat,
                data.numar_certificat,
                data.cod_indemnizatie,
                data.cod_loc_prescriere,
                data.cod_boala,
                data.data_acordarii,
                data.data_inceput,
                data.data_sfarsit,
                data.anul,
                data.luna
            ];
            const { rows } = await client.query(insertQuery, values);
            await client.query('COMMIT');
            return rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async update(id, data) {
        // Build dynamic SET clause and values array for PATCH (partial update)
        const fields = Object.keys(data);
        if (fields.length === 0) return null;

        const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
        const values = fields.map(field => data[field]);
        values.push(id); // last value for WHERE clause

        const query = `
            UPDATE ${this.Table}
            SET ${setClause}
            WHERE id = $${fields.length + 1}
            RETURNING *;
        `;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }            
};