import pool from "../../config/db.js";

export const PayslipModel = {
    async all() {
        // Implement logic to retrieve all payslips from the database
        const query = `SELECT 
            S.id, S.nume, S.prenume, S.cnp, 
            NSD.nume_departament, 
            SP.suma_plata_firma, SP.suma_plata_cass, 
            CO.co_plata
        FROM salarizare.salariati AS S
        INNER JOIN nomenclatoare.nom_salarii_departamente NSD
            ON NSD.id = S.id_departament
        LEFT JOIN salarizare.state_plata AS SP
            ON SP.id_salariat = S.id
        INNER JOIN salarizare.concedii_odihna AS CO
            ON CO.id_salariat = S.id
        group by S.id, NSD.nume_departament, SP.suma_plata_firma, SP.suma_plata_cass, CO.co_plata
        ORDER BY S.id ASC
        ;`;
        // Execute the query and return the results
        const { rows }  = await pool.query(query);
        return rows || [];
    },

    async findById(id) {
        // Implement logic to retrieve a specific payslip by ID from the database
        const query = `SELECT 
                S.nume, S.prenume, S.cnp, 
                NSD.nume_departament, 
                SP.suma_plata_firma, SP.suma_plata_cass, 
                CO.co_plata
            FROM salarizare.salariati AS S
            LEFT JOIN nomenclatoare.nom_salarii_departamente NSD
                ON NSD.id = S.id_departament
            LEFT JOIN salarizare.state_plata AS SP
                ON SP.id_salariat = S.id
            LEFT JOIN salarizare.concedii_odihna AS CO
                ON CO.id_salariat = S.id
            WHERE S.id = ?`;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    }
};