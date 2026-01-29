import { AdvancePaymentsModel } from "./AdvancePayments.model.js";

export const AdvancePaymentsService = {
    async getAll(id_firma) {
        const rows = await AdvancePaymentsModel.all(id_firma);

        return rows;// Placeholder return
    },

    async update(id, data) {
        const row = await AdvancePaymentsModel.update(id, data);
        return row;// Placeholder return
    },

    async getById(id) {
        const row = await AdvancePaymentsModel.findById(id);
        return row;// Placeholder return
    }
};