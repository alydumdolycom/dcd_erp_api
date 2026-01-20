import { MedicalHolidaysModel } from './medicalHolidays.model.js';   
export const MedicalHolidaysService = {
    async getAll() {
        const rows =  await MedicalHolidaysModel.all();
        return rows;
    },

    async create(data) {
        const row = await MedicalHolidaysModel.create(data);
        return row;
    },

    async update(id, data) {
        const row = await MedicalHolidaysModel.update(id, data);
        return row;
    },

    async delete(id) {
        const row = await MedicalHolidaysModel.delete(id);
        return row;
    }   
};