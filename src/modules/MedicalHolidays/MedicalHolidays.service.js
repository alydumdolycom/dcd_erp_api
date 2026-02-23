import { MedicalHolidaysModel } from './MedicalHolidays.model.js';   
export const MedicalHolidaysService = {
    
    async getAll(id_firma) {
        const rows =  await MedicalHolidaysModel.all(id_firma);
        return rows;
    },

    async create(data) {
        const find = await MedicalHolidaysModel.findByCertificate(data.numar_certificat);
        if (find) {
            return {
                success: false,
                message: 'Un concediu medical cu acest număr de certificat există deja'
            }
        }
        const row = await MedicalHolidaysModel.create(data);
        return row;
    },

    async getById(id) {
        const row = await MedicalHolidaysModel.findById(id);
        return row;
    },
    
    async update(id, data) {
        const find = await MedicalHolidaysModel.findById(id);
        if (!find) {
            return null;
        }
        const row = await MedicalHolidaysModel.update(id, data);
        return row;
    },

    async delete(id) {
        const find = await MedicalHolidaysModel.findById(id);
        if (!find) {
            return null;
        }
        const result = await MedicalHolidaysModel.delete(id);
        return result;
    },

    async getNomMedicalData() {
        const rows = await MedicalHolidaysModel.getNomMedicalData();
        return rows;
    },

    async getMedicalPrescription() {
        const rows = await MedicalHolidaysModel.getMedicalPrescription();
        return rows;
    },

    async calculatorBase(id,data) {
        const result = await MedicalHolidaysModel.calculatorBase(id, data);
        return result;
    },

    async getMedicalHolidaysLastSixMonths(id_salariat) {
        const result = await MedicalHolidaysModel.getMedicalHolidaysLastSixMonths(id_salariat);
        return result;
    }
};