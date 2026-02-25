import pool from "../../config/db.js";

export const PayslipModel = {
    async all() {

        const query = `SELECT
                SP.id, S.nume, S.prenume, S.cnp,
                NSD.nume_departament,
                NSMP.mod_plata,
                SP.suma_plata_firma,
                SP.suma_plata_cass,
                (SP.suma_plata_firma + SP.suma_plata_cass) AS CO_PLATA
            FROM salarizare.salariati AS S
            INNER JOIN salarizare.state_plata AS SP ON SP.id_salariat = S.id
            INNER JOIN salarizare.salariati_modplata AS SMP ON SMP.id_salariat = S.id
            INNER JOIN nomenclatoare.nom_salarii_modplata AS NSMP ON NSMP.id = SMP.id_modplata
            INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            WHERE SP.id_salariat_modplata = SMP.id
            GROUP BY NSMP.mod_plata, S.id, S.nume, S.prenume, S.cnp, NSD.nume_departament, SP.id
            ORDER BY S.nume ASC
        ;`;
        // Execute the query and return the results
        const { rows }  = await pool.query(query);
        return rows || [];
    },

    async findBy(an, luna, id_firma) {
        const query = `
            SELECT
                SP.id, S.nume, S.prenume, S.cnp,
                NSD.nume_departament,
                NSMP.mod_plata,
                SP.suma_plata_firma,
                SP.suma_plata_cass,
                (SP.suma_plata_firma + SP.suma_plata_cass) AS CO_PLATA
            FROM salarizare.salariati AS S
            INNER JOIN salarizare.state_plata AS SP ON SP.id_salariat = S.id
            INNER JOIN salarizare.salariati_modplata AS SMP ON SMP.id_salariat = S.id
            INNER JOIN nomenclatoare.nom_salarii_modplata AS NSMP ON NSMP.id = SMP.id_modplata
            INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            WHERE SP.id_salariat_modplata = SMP.id AND SP.luna = $1 AND SP.anul = $2 AND SP.id_firma = $3
            GROUP BY NSMP.mod_plata, S.id, S.nume, S.prenume, S.cnp, NSD.nume_departament, SP.id
            ORDER BY NSMP.mod_plata
        `;
        const { rows } = await pool.query(query, [luna, an, id_firma]);
        return rows;
    },

    async excelReports(luna, anul, id_firma) {  
        const query = `
            SELECT
                NSD.nume_departament,
                S.nume,
                S.prenume,
                SP.brut_firma AS tarifar,
                SP.salariu_baza AS brut,
                SP.venit_net AS net
            FROM salarizare.salariati AS S
            INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            INNER JOIN salarizare.state_plata AS SP ON SP.id_salariat = S.id
            WHERE SP.luna = $1 AND SP.anul = $2 AND S.id_firma = $3
            ORDER BY NSD.nume_departament, S.nume
        `;
        const { rows } = await pool.query(query, [luna, anul, id_firma]);
        return rows;
    },

    async getByPayrollType(id_modplata, luna, anul, id_firma) {

        const query = `
            SELECT
                SP.id, S.nume, S.prenume, S.cnp,
                NSD.nume_departament,
                NSMP.mod_plata,
                SP.suma_plata_firma,
                SP.suma_plata_cass,
                (SP.suma_plata_firma + SP.suma_plata_cass) AS CO_PLATA
            FROM salarizare.salariati AS S
            INNER JOIN salarizare.state_plata AS SP ON SP.id_salariat = S.id
            INNER JOIN salarizare.salariati_modplata AS SMP ON SMP.id_salariat = S.id
            INNER JOIN nomenclatoare.nom_salarii_modplata AS NSMP ON NSMP.id = SMP.id_modplata
            INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            WHERE SP.id_salariat_modplata = SMP.id AND SMP.id_modplata = $1 
            GROUP BY NSMP.mod_plata, S.id, S.nume, S.prenume, S.cnp, NSD.nume_departament, SP.id
            ORDER BY S.nume ASC
        `;
        const { rows } = await pool.query(query, [id_modplata]);
        console.log(rows)
        return rows;
    }
};
