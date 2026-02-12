import pool from "../../config/db.js";

export const AdvancePaymentsModel = {

    async all(id_firma) {
        const query = `SELECT
            DISTINCT
            S.id as id_salariat,   
            S.nume, 
            S.prenume,
            S.id_departament,
            NSD.nume_departament AS departament,
            SP.id,
            SP.avans_firma, 
            SP.avans_cass, 
            SP.zile_lucrate,
            SP.co_zile,
            SP.cm_zile_angajator,
            SP.luna,
            SP.anul,
            SP.cm_zile_cass,
            SP.co_primit,
            NSMP.mod_plata
        FROM salarizare.state_plata  SP
            LEFT JOIN salarizare.salariati S 
                ON SP.id_salariat = S.id
            LEFT JOIN  nomenclatoare.nom_salarii_departamente NSD
                ON S.id_departament = NSD.id
            LEFT JOIN nomenclatoare.nom_salarii_modplata  NSMP
                ON NSMP.id = SP.id_salariat_modplata
            LEFT JOIN salarizare.salariati_modplata SMP
                ON SMP.id_salariat = S.id
        WHERE S.id_firma = $1 and SMP.activ = true
        ORDER BY SP.id asc`;    
        const results = await pool.query(query, [id_firma]);
        return results.rows;
    },

    async update(id, data) {    
        try {
            // Build dynamic SET clause for PATCH (partial update)
            const query = `
                UPDATE salarizare.state_plata
                SET avans_firma = $1, avans_cass = $2
                WHERE id = $3
                RETURNING *
            `;
            const values = [data.avans_firma, data.avans_cass, id];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error updating advance payment record: " + error.message);
        }
    }
};