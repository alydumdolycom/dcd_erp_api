import pool from "../../config/db.js";

export const PayRollModel = {
    Table: 'salarizare.state_plata',
    async all(id_firma) {
        try {   
            const query = `SELECT S.nume, S.prenume, S.id_firma, 
                            SP.id,
                            SP.id_salariat,
                            SP.luna,
                            SP.zile_lucrate,
                            SP.zile_luna,
                            SP.co_zile,
                            SP.cm_zile_angajator,
                            SP.cm_zile_cass,
                            SP.suma_realizata,
                            SP.co_calculat,
                            SP.suma_medical_firma,
                            SP.suma_medical_cass
                            FROM ${this.Table} SP
                            LEFT JOIN salarizare.salariati S ON S.id = SP.id_salariat
                            WHERE S.id_firma = $1`;
            const { rows } =  await pool.query(query, [id_firma]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    async findById(id) {
        try {   
            const query = `SELECT S.nume, S.prenume, SP.* FROM ${this.Table} SP
                LEFT JOIN salarizare.salariati S ON S.id = SP.id_salariat
                WHERE SP.id = $1`;
            const { rows } =  await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },  

    async create(data) {
        // Logic to create a new payroll record
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const { rows } = await pool.query(
            `INSERT INTO ${this.Table} VALUES (${placeholders}) RETURNING *`,
            values
        );
        return rows[0];
    },

    async update(id, data) {
        // Logic to update a payroll record by ID using PATCH semantics
        const query = `UPDATE ${this.Table} SET zile_lucrate = $1 WHERE id = $2 RETURNING *`;
        const { rows } = await pool.query(query, [data.zile_lucrate, id]);
        return rows[0];
    },

    async delete(id) {
        // Logic to delete a payroll record by ID
        await pool.query(`DELETE FROM ${this.Table} WHERE id = $1`, [id]);
    },

    async findByDays(id_firma) {
        try {       
            const query = `SELECT * FROM salarizare.state_plata_header PH 
                            LEFT JOIN nomenclatoare.nom_luni NL 
                            ON NL.luna_numeric = PH.luna AND NL.anul = PH.anul
                            WHERE PH.id_firma = ${id_firma}    
                            order by PH.anul desc, PH.luna asc`
            const { rows } =  await pool.query(query);
            return rows;
        }
        catch (error) {
            throw error;
        }   
    }
};