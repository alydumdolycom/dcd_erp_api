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
    },

    async getByPayrollNumeric(luna, anul, id_firma) {  
        const query = `
            SELECT
                S.id,
                S.nume,
                S.prenume,
                NSD.nume_departament,
                (SP.suma_plata_firma + SP.suma_plata_cass) AS total_plata
            FROM salarizare.salariati AS S
            INNER JOIN salarizare.state_plata AS SP ON SP.id_salariat = S.id
            INNER JOIN salarizare.salariati_modplata AS SMP ON SMP.id_salariat = S.id
            INNER JOIN nomenclatoare.nom_salarii_modplata AS NSMP ON NSMP.id = SMP.id_modplata
            INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            WHERE SP.id_salariat_modplata = SMP.id AND SMP.id_modplata = 1 AND SP.luna = $1 AND SP.anul = $2 AND S.id_firma = $3
            GROUP BY NSD.nume_departament, S.id, S.nume, S.prenume, SP.suma_plata_firma, SP.suma_plata_cass
            ORDER BY NSD.nume_departament ASC, S.nume ASC    
        `;

        const { rows } = await pool.query(query, [luna, anul, id_firma]);
        return rows;
    },

    async getPayrollByCard(luna, anul, id_firma) {  
        const query = `
			 SELECT
                NSD.nume_departament,
				S.nume,
                S.prenume,
                SUM(SP.avans_cass + SP.avans_firma) AS suma
            FROM
				salarizare.salariati AS S
			INNER JOIN
				salarizare.state_plata AS SP ON S.id = SP.id_salariat
            INNER JOIN
                salarizare.salariati_modplata AS sm ON SP.id_salariat_modplata = sm.id
            INNER JOIN
                nomenclatoare.nom_salarii_modplata AS nm ON sm.id_modplata = nm.id
			INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            WHERE SP.luna = $1 AND SP.anul = $2 AND SP.id_firma = $3 AND sm.id_modplata != 1
            GROUP BY
                S.nume,
                S.prenume,
                nm.mod_plata,
				NSD.nume_departament
            ORDER BY
                nm.mod_plata ASC
        `;

        const { rows } = await pool.query(query, [luna, anul, id_firma]);
        return rows;
    },

    async getPayrollPaymentsTypes(luna, anul, id_firma) {  
        const query = `
            SELECT
                sm.id_modplata,
                nm.mod_plata AS ModPlata,
                SUM(SP.avans_cass + SP.avans_firma) AS TotalCoPlata
            FROM
                salarizare.state_plata AS SP
            INNER JOIN
                salarizare.salariati_modplata AS sm ON SP.id_salariat_modplata = sm.id
            INNER JOIN
                nomenclatoare.nom_salarii_modplata AS nm ON sm.id_modplata = nm.id
            WHERE SP.anul = $2 AND SP.luna = $1 AND SP.id_firma = $3
            GROUP BY
                nm.mod_plata, sm.id_modplata
            ORDER BY
                sm.id_modplata ASC
        `;

        const { rows } = await pool.query(query, [luna, anul, id_firma]);
        return rows;
    },

    async getPayrollPaymentByType(luna, anul, id_firma, id_mod_plata) {
        const query = `
			 SELECT
                NSD.nume_departament,
				S.nume,
                S.prenume,
                SUM(SP.avans_cass + SP.avans_firma) AS suma
            FROM
				salarizare.salariati AS S
			INNER JOIN
				salarizare.state_plata AS SP ON S.id = SP.id_salariat
            INNER JOIN
                salarizare.salariati_modplata AS sm ON SP.id_salariat_modplata = sm.id
            INNER JOIN
                nomenclatoare.nom_salarii_modplata AS nm ON sm.id_modplata = nm.id
			INNER JOIN nomenclatoare.nom_salarii_departamente AS NSD ON NSD.id = S.id_departament
            WHERE SP.luna = $1 AND SP.anul = $2 AND SP.id_firma = $3 AND sm.id_modplata = $4
            GROUP BY
                S.nume,
                S.prenume,
                nm.mod_plata,
				NSD.nume_departament
            ORDER BY
                nm.mod_plata ASC
        `;

        const { rows } = await pool.query(query, [luna, anul, id_firma, id_mod_plata]);
        return rows;
    },

    async getModPlataName(id_mod_plata) {
        const query = `
            SELECT mod_plata
            FROM nomenclatoare.nom_salarii_modplata
            WHERE id = $1
        `;  
        const { rows } = await pool.query(query, [id_mod_plata]);
        return rows[0]?.mod_plata || null;
    }
};
