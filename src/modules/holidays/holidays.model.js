import pool from "../../config/db.js";

export const HolidaysModel = {
    Table: 'salarizare.concedii_odihna',
    async all() {
        // Database logic to get all holidays
        const query = `
                    SELECT 
                        SCO.*, 
                        S.id, S.nume, S.prenume 
                    FROM ${this.Table} as SCO
                    LEFT JOIN salarizare.salariati S
                        ON SCO.id_salariat = S.id
                    ORDER BY SCO.id DESC`;
        // Execute query and return results
        const { rows } = await pool.query(query);
        return rows;
    },

    async findById(id) {
        // Database logic to find a holiday by ID
        const query = `
                    SELECT * FROM ${this.Table} 
                    LEFT JOIN salarizare.salariati 
                        ON ${this.Table}.id_salariat = salarizare.salariati.id
                    WHERE ${this.Table}.id = $1`;
        // Execute query with id and return result
        const { rows } = await pool.query(query, [id]);
        return rows;
    },

    async create(holidayData) {
        // Database logic to insert a new holiday
        const query = `
                INSERT INTO ${this.Table} 
                (id_salariat, zile_co, zile_co_plata, baza_calcul, anul, luna, perioada, co_plata, co_compensare, id_modalitate_plata, nou, data_borderou, data_operare)
                VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING *`;
        const values = [
            holidayData.id_salariat,
            holidayData.zile_co,
            holidayData.zile_co_plata,
            holidayData.baza_calcul,
            holidayData.anul,
            holidayData.luna,
            holidayData.perioada,
            holidayData.co_plata,
            holidayData.co_compensare,
            holidayData.id_modalitate_plata,
            holidayData.nou,
            holidayData.data_borderou,
            holidayData.data_operare
        ];
        // Execute query with holidayData and return new holiday    
        const { rows } = await pool.query(query, values);
        return rows;
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