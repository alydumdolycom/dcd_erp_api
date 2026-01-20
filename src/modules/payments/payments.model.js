import pool from "../../config/db.js";

/* Payments Model */
export const PaymentsModel = {
    Table: "salarizare.salariati_modplata",
    /* Get all payment methods */
    async all() {
        const { rows } = await pool.query(
        `SELECT * FROM ${this.Table}`
        );
        return rows;
    },

    /* create a new payment method */
    async create(paymentData) {
        try {   
            const { id_salariat, id_modplata, cont_bancar, activ } = paymentData;
            const { rows } = await pool.query(
            `INSERT INTO salarizare.salariati_modplata(
            id_salariat, id_modplata, cont_bancar, activ) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
            [ id_salariat, id_modplata, cont_bancar, activ ]);
            return rows[0];        
        } catch (err) {
           throw err;
        }
    },

    /* update payment method */
    async update(id, paymentData) {
        const fields = [];
        const values = [];
        let index = 1;

        if (paymentData.id_salariat !== undefined) {
            fields.push(`id_salariat = $${index++}`);
            values.push(paymentData.id_salariat);
        }

        if (paymentData.id_modplata !== undefined) {
            fields.push(`id_modplata = $${index++}`);
            values.push(paymentData.id_modplata);
        }

        if (paymentData.cont_bancar !== undefined) {
            fields.push(`cont_bancar = $${index++}`);
            values.push(paymentData.cont_bancar);
        }

        if (paymentData.activ !== undefined) {
            fields.push(`activ = $${index++}`);
            values.push(paymentData.activ);
        }

        if (fields.length === 0) {
            return null; // nimic de updatat
        }

        const query = `
            UPDATE salarizare.salariati_modplata
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING *;
        `;

        values.push(id);

        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    /* delete payment method */
    async delete(id) {
        await pool.query(
        `DELETE FROM salarizare.salariati_modplata
        WHERE id = $1;`,
        [id]);
    }
};  