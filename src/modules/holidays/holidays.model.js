import pool from "../../config/db.js";

export const HolidaysModel = {
    Table: 'salarizare.concedii_odihna',
    async all() {
        // Database logic to get all holidays
        const query = `
            SELECT 
                SCO.*, 
                S.id as id_salariat, S.nume, S.prenume, 
                NSD.nume_departament
            FROM salarizare.concedii_odihna as SCO
            LEFT JOIN salarizare.salariati S
                ON SCO.id_salariat = S.id
            LEFT JOIN nomenclatoare.nom_salarii_departamente  NSD 
                ON NSD.id = S.id_departament
            ORDER BY S.nume, S.prenume
        `;
        // Execute query and return results
        const { rows } = await pool.query(query);
        return rows;
    },

    async findById(id) {
        // Database logic to find a holiday by ID
        const find = await pool.query(`SELECT * FROM ${this.Table} WHERE id = $1`, [id]);
        if (find.rows.length === 0) {
            return null;
        }
        const query = `
            SELECT 
                SCO.*, 
                S.id as id_salariat, S.nume, S.prenume, 
                NSD.nume_departament
            FROM salarizare.concedii_odihna as SCO
            LEFT JOIN salarizare.salariati S
                ON SCO.id_salariat = S.id
            LEFT JOIN nomenclatoare.nom_salarii_departamente  NSD 
                ON NSD.id = S.id_departament
            WHERE SCO.id = $1
            ORDER BY S.nume, S.prenume`;
        
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    async countHolidaysPerEmployee(id_salariat) {
        const query = `
            SELECT COUNT(*) AS total_concedii
            FROM ${this.Table}
            WHERE id_salariat = $1; 
        `;
        const values = [id_salariat];
        const { rows } = await pool.query(query, values);
        return rows[0].total_concedii || 0;
    },

    async findEmployeePaymentMethod(id) {
        const employees = `
        SELECT SMP.id FROM salarizare.salariati S
            LEFT JOIN salarizare.salariati_modplata SMP ON S.id = SMP.id_salariat
            LEFT JOIN nomenclatoare.nom_salarii_modplata N ON N.id = SMP.id_modplata
        WHERE S.id = $1
            LIMIT 1;
        `;
        const values = [id];
        const { rows } = await pool.query(employees, values);
        return rows[0] || null;
    },

    async create(data) {
        const client = await pool.connect();
        const salariat = await this.findEmployeePaymentMethod(data.id_salariat);
        try {
            await client.query("BEGIN");

            const query = `
            INSERT INTO ${this.Table}
            (
                id_salariat,
                zile_co,
                zile_co_plata,
                baza_calcul,
                anul,
                luna,
                perioada,
                co_plata,
                co_compensare,
                id_modalitate_plata,
                nou,
                data_borderou,
                data_operare
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *;
            `;

            const values = [
                data.id_salariat,
                data.zile_co,
                data.zile_co_plata,
                data.baza_calcul,
                data.anul,
                data.luna,
                data.perioada,
                data.co_plata,
                data.co_compensare,
                salariat.id,
                data.nou,
                data.data_borderou,
                data.data_operare
            ];

            const { rows } = await client.query(query, values);

            await client.query("COMMIT");
            return rows[0];

        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Create concediu_odihna failed:", error);
            throw error;
        } finally {
            client.release();
        }
    },

    async update(id, holidayData) {
        // Database logic to update an existing holiday
        // Build dynamic SET clause for PATCH (partial update)
        const fields = [];
        const values = [];
        let idx = 1;

        for (const [key, value] of Object.entries(holidayData)) {
            fields.push(`${key} = $${idx++}`);
            values.push(value);
        }
        if (fields.length === 0) {
            throw new Error("No fields to update");
        }
        values.push(id); // id is last parameter

        const query = `
            UPDATE ${this.Table}
            SET ${fields.join(', ')}
            WHERE id = $${idx}
            RETURNING *`;

        const { rows } = await pool.query(query, values);
        return rows;
    },

    async delete(id) {
        // Database logic to delete a holiday
        const query = ` 
                    DELETE FROM ${this.Table}
                    WHERE id = $1`;
        // Execute query with id
        await pool.query(query, [id]);    
    }   
};