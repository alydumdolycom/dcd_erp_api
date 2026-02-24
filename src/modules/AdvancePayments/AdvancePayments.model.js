import pool from "../../config/db.js";

export const AdvancePaymentsModel = {

    async all(id_firma) {
        const query = `SELECT  
                SP.id, SP.luna, SP.anul, SP.zile_lucrate, SP.avans_firma, SP.avans_cass, SP.co_zile, SP.cm_zile_angajator, SP.cm_zile_cass, SP.co_primit,
                S.id AS id_salariat, S.nume, S.prenume,
                NSMP.mod_plata,
                NSD.nume_departament, NSD.id AS id_departament
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
            const updates = [];
            const values = [];
            let paramIndex = 1;

            if (data.avans_firma !== undefined) {
                updates.push(`avans_firma = $${paramIndex}`);
                values.push(data.avans_firma);
                paramIndex++;
            }

            if (data.avans_cass !== undefined) {
                updates.push(`avans_cass = $${paramIndex}`);
                values.push(data.avans_cass);
                paramIndex++;
            }

            if (updates.length === 0) {
                return { success: false, message: "No fields to update" };
            }

            values.push(id);
            const query = `
                UPDATE salarizare.state_plata
                SET ${updates.join(', ')}
                WHERE id = $${paramIndex}
            `;
            
            await pool.query(query, values);
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    async reportsAdvancePayments(luna, anul, id_firma) {
        const query = `
            SELECT 
                SP.luna, SP.anul,
                NSMP.mod_plata, 
                (COALESCE(SP.avans_cass, 0) + COALESCE(SP.avans_firma, 0)) AS avans 
            FROM salarizare.state_plata AS SP
                INNER JOIN salarizare.salariati_modplata AS SMP ON SMP.id_modplata = SP.id_salariat_modplata
                INNER JOIN nomenclatoare.nom_salarii_modplata AS NSMP ON NSMP.id = SMP.id_modplata
            WHERE SP.luna = $1 AND SP.anul = $2 AND SP.id_firma = $3
            GROUP BY NSMP.mod_plata, avans, SP.luna, SP.anul`;
        const values = [luna, anul, id_firma];
        const { rows } = await pool.query(query, values);
        return rows;
    }
};