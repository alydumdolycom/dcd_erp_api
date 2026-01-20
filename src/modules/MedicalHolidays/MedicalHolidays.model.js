import pool from "../../config/db.js";

export const MedicalHolidaysModel = {
    Table: "salarizare.concedii_medicale",

    async all() {
        const { rows } = await pool.query(
            `SELECT * FROM ${this.Table}`
        );
        return rows;
    },

    async create(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const zile_cass =
                    data.zile_boala +
                    data.zile_accidente +
                    data.zile_sarcina +
                    data.zile_ingrijire_copil +
                    data.zile_crestere_copil;
            const insertQuery = `
                INSERT INTO ${this.Table} (
                    id_salariat,
                    zile_baza_calcul,
                    suma_baza_calcul,
                    baza_zi,
                    procent,
                    zile_angajator,
                    suma_angajator,
                    zile_cass,
                    zile_boala,
                    zile_accidente,
                    zile_sarcina,
                    zile_ingrijire_copil,
                    zile_crestere_copil,
                    serie_certificat,
                    numar_certificat,
                    cod_indemnizatie,
                    cod_loc_prescriere,
                    cod_boala,
                    data_acordarii,
                    data_inceput,
                    data_sfarsit,
                    serie_certificat_initial,
                    numar_certificat_initial,
                    data_certificat_initial,
                    cod_urgenta,
                    aviz_medic_expert,
                    cnp_copil,
                    anul,
                    luna
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10,
                    $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20,
                    $21, $22, $23, $24, $25,
                    $26, $27, $28, $29
                )
                RETURNING *;
            `;
            const values = [
                data.id_salariat,
                data.zile_baza_calcul,
                data.suma_baza_calcul,
                data.baza_zi,
                data.procent,
                data.zile_angajator,
                DEFAULT,
                data.suma_angajator,
                data.zile_boala,
                data.zile_accidente,
                data.zile_sarcina,
                data.zile_ingrijire_copil,
                data.zile_crestere_copil,
                data.serie_certificat,
                data.numar_certificat,
                data.cod_indemnizatie,
                data.cod_loc_prescriere,
                data.cod_boala,
                data.data_acordarii,
                data.data_inceput,
                data.data_sfarsit,
                data.serie_certificat_initial,
                data.numar_certificat_initial,
                data.data_certificat_initial,
                data.cod_urgenta,
                data.aviz_medic_expert,
                data.cnp_copil,
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