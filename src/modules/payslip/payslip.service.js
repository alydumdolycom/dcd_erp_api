import { PayslipModel } from "./payslip.model.js";

export const PayslipService = {
    
    async getAll() {
        const rows = await PayslipModel.all();
        return rows;
    },

    async findBy(luna, anul, id_firma) {
        const rows = await PayslipModel.findBy(luna, anul, id_firma);
        return rows;
    }
};