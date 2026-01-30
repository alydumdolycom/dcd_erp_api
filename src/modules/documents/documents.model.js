import pool from "../../config/db.js";

export const DocumentsModel = {
    Table: "salarizare.acte_aditionale",
    // Define your document schema and methods here
    async all({ id_firma, id_departament, search }) {
        try {
            let query = `
                SELECT 
                    AA.id as act_id, AA.salariu_vechi, AA.salariu_nou, AA.salariu_baza, AA.spor_vechime, AA.spor_repaus, AA.spor_noapte, 
                    cast(AA.data_incepere as date) as data_incepere, cast(AA.data_act as date) as data_act, AA.numar_act, 
                    AA.operat,
                    cast(AA.data_incetare as date) as data_incetare, cast(AA.data_operare as date) as data_operare, AA.operat_de,
                    S.id as id_salariat, S.nume, S.prenume, S.cnp, S.prod_tesa, S.sex, S.id_functie, S.id_tip_contract, S.id_ore_norma,
                    S.salar_baza AS salar_init, S.data_contract, S.nr_contract,
                    S.id_departament, S.data_angajarii, S.data_incetarii, AA.numar_act,
                    NSD.id AS id_departament,
                    NSD.nume_departament,
                    NSF.nume_functie
                FROM salarizare.acte_aditionale AS AA
                LEFT JOIN salarizare.salariati S
                    ON S.id = AA.id_salariat
                LEFT JOIN nomenclatoare.nom_salarii_departamente NSD 
                    ON NSD.id = S.id_departament
                LEFT JOIN nomenclatoare.nom_salarii_functii NSF 
                    ON NSF.id = S.id_functie
                WHERE S.id_firma = ${id_firma}
            `;
            const values = [];
            let idx = 1;

            if (id_departament) {
                query += ` AND S.id_departament = $${idx}`;
                values.push(id_departament);
                idx++;
            }
            if (search) {
                query += ` AND (S.nume ILIKE $${idx} OR S.prenume ILIKE $${idx} OR S.cnp ILIKE $${idx})`;
                values.push(`%${search}%`);
                idx++;
            }

            query += ` ORDER BY S.nume, S.prenume ASC`;

            const { rows } = await pool.query(query, values);
            return rows || null;
        } catch (error) {
            throw error;
        }
    },
    
    async create(data) {
        try {
            const values = [
                data.id_salariat,
                data.salariu_vechi,
                data.salariu_baza,
                data.spor_vechime,
                data.spor_repaus,
                data.spor_noapte,
                data.data_incepere,
                data.data_act,
                data.numar_act,
                data.nr_contract,
                data.data_contract,
                data.operat_de,
                data.data_incetare,
                data.data_operare
            ];

            const query = `
                INSERT INTO ${this.Table} 
                (id_salariat, salariu_vechi, salariu_baza, spor_vechime, spor_repaus, spor_noapte, data_incepere, data_act, numar_act, nr_contract, data_contract, operat_de, data_incetare, data_operare) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            `;

            const rows = await pool.query(query, values);
            return rows;

        } catch (error) {
            throw error;
        }
    },

    async findById(id) {
        const rows = await pool.query(`
            SELECT * FROM ${this.Table}
            LEFT JOIN salarizare.salariati 
                ON salarizare.salariati.id = ${this.Table}.id_salariat
            WHERE ${this.Table}.id = $1
        `, [id]);
        return rows[0];
    },

    async update(id, data) {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const key in data) {
            fields.push(`${key} = $${idx}`);
            values.push(data[key]);
            idx++;
        }
        values.push(id); // for WHERE clause

        const query = `
            UPDATE ${this.Table}
            SET ${fields.join(", ")}
            WHERE id = $${idx}
            RETURNING *;
        `;
        const result = await pool.query(query, values);
        
        return result.rows[0];
    },

    async delete(id) {
        await pool.query(`
            DELETE FROM ${this.Table} WHERE ${this.Table}.id = $1
        `, [id]);
    },
    
    async findByEmployeeId(id_employee) {
        const query = `
                SELECT * FROM ${this.Table} 
                WHERE id_salariat = $1`;
        const values = [id_employee];
        const { rows } = await pool.query(query, values);
        return rows || null;
    }
};