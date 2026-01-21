import pool from "../../config/db.js";

export const MedicalHolidaysModel = {
    Table: "salarizare.concedii_medicale",

    async all(id_firma) {
        const { rows } = await pool.query(
            `SELECT CM.*, S.nume, S.prenume FROM ${this.Table} as CM
<<<<<<< HEAD
             LEFT JOIN salarizare.salariati as S ON CM.id_salariat = S.id
             WHERE S.id_firma = $1
             ORDER BY CM.id DESC;`,
            [id_firma] 
=======
             LEFT JOIN salarizare.salariati as S ON CM.id_salariat = S.id`
>>>>>>> 163a85e802ae57a9b6497dd8b8c916b772c98063
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
                    luna,
                    id_utilizator
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10,
<<<<<<< HEAD
                    $11, $12
=======
                    $11
>>>>>>> 163a85e802ae57a9b6497dd8b8c916b772c98063
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
                data.luna,  
                data.id_utilizator
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