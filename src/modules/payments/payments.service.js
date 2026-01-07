import { PaymentsModel } from "./payments.model.js";

export const PaymentsService = {
    async getAll() {
        // Logic to retrieve all payments
       return PaymentsModel.all();
    }
};
