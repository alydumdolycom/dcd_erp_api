import { pool } from "../../config/db.js";

export const DocumentsModel = {
    Table: "salarizare.acte_aditionale",
    // Define your document schema and methods here
    async all() {
        const rows = await pool.query(`
            SELECT * FROM ${this.Table}
            LEFT JOIN salarizare.salariati 
                ON salarizare.salariati.id = ${this.Table}.salariat_id`
        );
        return rows;
    },

    async create(data) {
        return data; // Placeholder for creating a document
    },

    async findById(id) {
        return { id }; // Placeholder for fetching a document by ID
    },

    async update(id, data) {
        return { id, ...data }; // Placeholder for updating a document
    },

    async delete(id) {
        return { id }; // Placeholder for deleting a document
    }
};