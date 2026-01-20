import { MedicalHolidaysService } from './MedicalHolidays.service.js';

export const MedicalHolidaysController = {
    async getAll(req, res, next) {
        try {
            // Logic to get all medical holidays
            const data = await MedicalHolidaysService.getAll();
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }    
    },
    
    async create(req, res, next) {
        try {
            // Logic to create a new medical holiday
            const data = await MedicalHolidaysService.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            // Logic to update a medical holiday
            const data = await MedicalHolidaysService.update(req.params.id, req.body);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            // Logic to delete a medical holiday
            await MedicalHolidaysService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }   
};