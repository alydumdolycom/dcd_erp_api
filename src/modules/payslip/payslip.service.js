import { PayslipModel } from "./payslip.model.js";

export const PayslipService = {
    
    async getAll() {
        const rows = await PayslipModel.all();
        return rows;
    },

    async getById(id) {
        const row = await PayslipModel.findById(id);
        return row || null;
    }
}