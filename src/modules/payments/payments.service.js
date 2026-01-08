import { PaymentsModel } from "./payments.model.js";

export const PaymentsService = {
    async getAll() {
        // Logic to retrieve all payments
       return PaymentsModel.all();
    },

    async create(paymentData) {
        // Logic to create a new payment
       return PaymentsModel.create(paymentData);
    },

    async update(id, paymentData) {
        // Logic to update an existing payment
       return PaymentsModel.update(id, paymentData);
    },

    async delete(id) {
        // Logic to delete a payment
       return PaymentsModel.delete(id);
    }
};
