import { PaymentsModel } from "./payments.model.js";

/* Service layer for handling payment-related operations */
export const PaymentsService = {

    /* Retrieve all payments */
    async getAll() {
        // Logic to retrieve all payments
       return PaymentsModel.all();
    },

    /* create a new payment */
    async create(paymentData) {
        // Logic to create a new payment
       return PaymentsModel.create(paymentData);
    },

    /* update an existing payment */
    async update(id, paymentData) {
        // Logic to update an existing payment
       return PaymentsModel.update(id, paymentData);
    },

    /* delete a payment */
    async delete(id) {
        // Logic to delete a payment
       return PaymentsModel.delete(id);
    }
};
