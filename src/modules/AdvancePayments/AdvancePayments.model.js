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

    reportsAdvancePayments(id_mod_plata) {
        const query = `
            SELECT 
                COALESCE((SP.suma_plata_firma + SP.suma_plata_cass), 0) AS AVANS
            FROM salarizare.salariati AS S
            LEFT JOIN nomenclatoare.nom_salarii_departamente NSD
                ON NSD.id = S.id_departament
            LEFT JOIN salarizare.state_plata AS SP
                ON SP.id_salariat = S.id
            LEFT JOIN salarizare.concedii_odihna AS CO
                ON CO.id_salariat = S.id
            ORDER BY S.id
        `;
        return pool.query(query, [id_mod_plata]);
    }
};