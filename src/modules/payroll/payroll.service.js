import { PayRollModel } from "./payroll.model.js";

export const PayRollService = {
    async getAll(params) {
        // Logic to get all payroll records
        const result = await PayRollModel.all(params);
        return result;
    },

    async getById(id) {
        // Logic to get a payroll record by ID
        const result = await PayRollModel.findById(id);
        return result;    
    },

    async create(data) {
        // Logic to create a new payroll record
        const result = await PayRollModel.create(data);
        return result;
    },

    async update(id, data) {
        // Logic to update a payroll record by ID
        const result = await PayRollModel.update(id, data);
        return result;
    },

    async delete(id) {
        // Logic to delete a payroll record by ID
        const result = await PayRollModel.delete(id);
        return result;
    },
    
    async getPayrollByDays(id_firma) {
        // Logic to get payroll records by days
        const data = await PayRollModel.findByDays(id_firma);
        return data;
    }   
};