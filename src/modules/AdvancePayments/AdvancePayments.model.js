import pool from "../../config/db.js";

export const AdvancePaymentsModel = {

    async all(id_firma) {
        const query = `SELECT  
                S.id AS id_salariat, S.nume, S.prenume,
                NSMP.mod_plata,
                NSD.nume_departament, NSD.id AS id_departament, 
                SP.luna, SP.anul, SP.zile_lucrate, SP.avans_firma, SP.avans_cass, SP.co_zile, SP.cm_zile_angajator, SP.cm_zile_cass, SP.co_primit
            FROM salarizare.salariati AS S
            JOIN salarizare.state_plata SP 
                ON SP.id_salariat = S.id
            JOIN nomenclatoare.nom_salarii_departamente NSD 
                ON NSD.id = S.id_departament
            JOIN salarizare.salariati_modplata SMP 
                ON SMP.id = SP.id_salariat_modplata
            JOIN nomenclatoare.nom_salarii_modplata NSMP 
                ON SMP.id_modplata = NSMP.id
            WHERE S.id_firma = $1
            ORDER BY SP.id ASC;`;
      
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