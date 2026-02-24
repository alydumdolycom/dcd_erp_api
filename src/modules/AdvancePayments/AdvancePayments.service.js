import { AdvancePaymentsModel } from "./AdvancePayments.model.js";

export const AdvancePaymentsService = {
    async getAll(id_firma) {
        const rows = await AdvancePaymentsModel.all(id_firma);

        return rows;// Placeholder return
    },

    async update(id, data) {
        const rows = await AdvancePaymentsModel.update(id, data);
        return rows;// Placeholder return
    },

    async getById(id) {
        const rows = await AdvancePaymentsModel.findById(id);
        return rows;
    },

    async reportsAdvancePayments(luna, anul, id_firma) {
        const rows = await AdvancePaymentsModel.reportsAdvancePayments(luna, anul, id_firma);
        return rows;
    }
};