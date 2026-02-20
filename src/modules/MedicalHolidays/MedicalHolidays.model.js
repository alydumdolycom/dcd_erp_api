import pool from "../../config/db.js";

export const MedicalHolidaysModel = {
    Table: "salarizare.concedii_medicale",

    async all(id_firma) {
        const query = `SELECT
                        CM.id, CM.luna, CM.id_salariat,
                        CM.anul,
                        CM.serie_certificat, CM.numar_certificat,
                        CM.cod_indemnizatie, CM.cod_loc_prescriere,
                        CM.cod_boala, CM.data_acordarii,
                        CM.data_inceput, CM.data_sfarsit,
                        CM.procent, CM.zile_angajator,
                        CM.zile_boala, CM.zile_accidente,
                        CM.zile_sarcina, CM.zile_ingrijire_copil,
                        CM.zile_crestere_copil, CM.id_utilizator,
                        CM.aviz_medic_expert,
                        CM.procent, CM.zile_angajator, CM.zile_cass,
                        CM.data_certificat_initial, CM.cod_urgenta, CM.cnp_copil, CM.numar_certificat_initial, CM.serie_certificat_initial,
                        (CM.zile_angajator + CM.zile_cass) AS zile,
                        S.id AS id_salariat,
                        S.nume, S.prenume,
                        NSD.nume_departament,
                        NSD.id AS id_departament
                    FROM salarizare.concedii_medicale CM
                    LEFT JOIN salarizare.salariati S 
                        ON CM.id_salariat = S.id
                    LEFT JOIN nomenclatoare.nom_salarii_departamente NSD 
                        ON NSD.id = S.id_departament
                    WHERE S.id_firma = $1
                    ORDER BY CM.id DESC;
            `;
        const { rows } = await pool.query(query, [id_firma]);
        return rows;
        // const { rows } = await pool.query(
        //     `SELECT 
        //         sum(CM.zile_angajator+CM.zile_cass) as zile, CM.an, CM.luna, CM.id, CM.id_salariat, CM.serie_certificat, CM.numar_certificat, CM.cod_indemnizatie, CM.cod_loc_prescriere, CM.cod_boala,
        //         CM.data_acordarii, CM.data_inceput, CM.data_sfarsit, CM.procent, CM.zile_angajator, CM.zile_boala, CM.zile_accidente, CM.zile_sarcina,
        //         CM.zile_ingrijire_copil, CM.zile_crestere_copil, CM.id_utilizator, CM.aviz_medic_expert,
        //         S.id as id_salariat,
        //         S.nume, S.prenume,
        //         NSD.nume_departament, NSD.id as id_departament
        //     FROM ${this.Table} as CM
        //         LEFT JOIN salarizare.salariati as S ON CM.id_salariat = S.id
        //         LEFT JOIN nomenclatoare.nom_salarii_departamente NSD 
        //             ON NSD.id = S.id_departament    
        //         WHERE S.id_firma = $1
        //      ORDER BY CM.id DESC;`,
        //     [id_firma] 
        // );
        // return rows;
    },

    async findByCertificate(numar_certificat) {
        const query = `SELECT * FROM ${this.Table} WHERE numar_certificat = $1;`;
        const { rows } = await pool.query(query, [numar_certificat]);
        return rows[0] || null;
    },

    async create(data) {
        const client = await pool.connect();
        try {
            // Validate data.cnp_copil: must be 13 digit string if provided
            if (data.cnp_copil && (!/^\d{13}$/.test(data.cnp_copil))) {
                return {
                    success: false,
                    message: 'cnp_copil trebuie să fie un șir de 13 cifre'
                };
            }

            await client.query('BEGIN');
            const query = `
                INSERT INTO ${this.Table} (
                    id_salariat, serie_certificat, numar_certificat, cod_indemnizatie, cod_loc_prescriere, cod_boala,
                    data_acordarii, data_inceput, data_sfarsit, anul, luna, procent,
                    zile_angajator, zile_boala, zile_accidente, zile_sarcina,
                    id_firma,
                    zile_ingrijire_copil, zile_crestere_copil, id_utilizator, aviz_medic_expert,
                    data_certificat_initial, cod_urgenta, cnp_copil,  numar_certificat_initial, serie_certificat_initial
                ) VALUES (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16,
                    $17, $18, $19, $20,
                    $21, $22, $23, $24, $25, $26
                )
                RETURNING *;
            `;
            const values = [
                data.id_salariat, data.serie_certificat, data.numar_certificat, data.cod_indemnizatie, data.cod_loc_prescriere, data.cod_boala,
                data.data_acordarii, data.data_inceput, data.data_sfarsit, data.anul, data.luna, data.procent,
                data.zile_angajator, data.zile_boala, data.zile_accidente, data.zile_sarcina,
                data.id_firma,
                data.zile_ingrijire_copil, data.zile_crestere_copil, data.id_utilizator, data.aviz_medic_expert,
                data.data_certificat_initial, data.cod_urgenta, data.cnp_copil, data.numar_certificat_initial, data.serie_certificat_initial
            ];
            const { rows } = await client.query(query, values);
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
        const fields = Object.keys(data).filter(field => data[field] !== undefined);
        if (fields.length === 0) return null;

        const setClause = fields.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
        const values = fields.map(field => data[field]);
        values.push(id); // last value for WHERE clause

        const parameterIndex = fields.length + 1;
        const query = `
            UPDATE ${this.Table}
            SET ${setClause}
            WHERE id = $${parameterIndex}
            RETURNING *;
        `;
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    },
    
    async getNomMedicalData() { 
        const { rows } = await pool.query(
            `SELECT * FROM nomenclatoare.nom_medicale_cod_indemnizatie;`
        );
        return rows;
    },
    
    async getMedicalPrescription() {
        const { rows } = await pool.query(
            `SELECT * FROM nomenclatoare.nom_medicale_loc_prescriere;`
        );
        return rows;
    },

    async findById(id) {
        const query = `SELECT * FROM ${this.Table} WHERE id = $1;`;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    },

    async delete(id) {
        const query = `DELETE FROM ${this.Table} WHERE id = $1;`;
        const result  = await pool.query(query, [id]);
        return result.rowCount > 0 ? result.rows[0] : null;
    },

    async calculatorBase(id, data) {
        const query = `
            UPDATE ${this.Table} 
            SET 
                procent = $1,
                zile_angajator = $2,
                baza_zi = $3, 
                suma_baza_calcul = $4, 
                zile_baza_calcul = $5,
                suma_cass = $6
            WHERE 
                id = $7
            RETURNING *
        `;
        const values = [
            data.procent,
            data.zile_angajator,
            data.baza_zi,
            data.suma_baza_calcul,
            data.zile_baza_calcul,
            data.suma_cass,
            id
        ];
        const { rows } = await pool.query(query, values);
        return rows;
    }
};
    
