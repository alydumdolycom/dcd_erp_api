import { MedicalHolidaysModel } from './MedicalHolidays.model.js';   
export const MedicalHolidaysService = {
    async getAll(id_firma) {
        const rows =  await MedicalHolidaysModel.all(id_firma);
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