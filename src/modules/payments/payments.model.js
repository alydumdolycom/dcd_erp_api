import pool from "../../config/db.js";

export const PaymentsModel = {
    Table: "salarizare.salariati_modplata",
    // Define your payment model structure here
    async all() {
        const { rows } = await pool.query(
        `SELECT * FROM ${this.Table}`
        );
        return rows;
    }
};  