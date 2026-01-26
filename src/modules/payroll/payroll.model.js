import pool from '../../config/db.js';

export const PayRollModel = {
    Table: 'salarizare.state_plata',
    async all() {
        const [rows] = await pool.execute(`SELECT * FROM ${this.Table}`);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.execute(`SELECT * FROM ${this.Table} WHERE id = ?`, [id]);
        return rows[0];
    },  

    async create(data) {
        // Logic to create a new payroll record
        const [result] = await pool.execute(`INSERT INTO ${this.Table} SET ?`, data);
        return result;
    },

    async update(id, data) {
        // Logic to update a payroll record by ID
        const [result] = await pool.execute(`UPDATE ${this.Table} SET ? WHERE id = ?`, [data, id]);
        return result;
    },

    async delete(id) {
        // Logic to delete a payroll record by ID
        const [result] = await pool.execute(`DELETE FROM ${this.Table} WHERE id = ?`, [id]);
        return result;
    }
};