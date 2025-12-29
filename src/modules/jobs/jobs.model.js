import pool from "../../config/db.js";

export const JobsModel = {
  // Define model properties and methods here
    Table: 'nom_salarii_functii',

    async get() {
        // Example: Get all records from the table
        const { rows } = await pool.query(
        `SELECT * FROM ${this.Table}`
        );
        return rows
    },

    async create(data) {
       const query = `INSERT INTO ${this.Table} (nume_functie, observatii, cod_cor, functie_cor) VALUES ($1, $2, $3, $4) RETURNING *`;
       const values = [data.nume_functie, data.observatii, data.cod_cor, data.functie_cor];
       const { rows } = await pool.query(query, values);
       return rows[0];
    },

    async update(id, data) {
        // Update a record by id (assuming there's a primary key 'id')
        return await pool.query(
        `UPDATE ${this.Table} SET nume_functie = $1, observatii = $2, cod_cor = $3, functie_cor = $4 WHERE id = $5`,
        [data.nume_functie, data.observatii, data.cod_cor, data.functie_cor, id]
        );
    },

    async delete(id) {
        // Delete a record by id
        return await pool.query(
        `DELETE FROM ${this.Table} WHERE id = $1`,
        [id]
        );
    }
};