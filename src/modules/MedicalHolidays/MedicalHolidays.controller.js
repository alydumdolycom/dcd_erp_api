import { MedicalHolidaysService } from './MedicalHolidays.service.js';

export const MedicalHolidaysController = {
    async getAll(req, res, next) {
        try {
            const data = await MedicalHolidaysService.getAll(req.query.id_firma);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }    
    },
    
    async create(req, res, next) {
        try {
            req.body.id_utilizator = req.user.id;
            const data = await MedicalHolidaysService.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            req.body.id_utilizator = req.user.id;
            const data = await MedicalHolidaysService.update(req.params.id, req.body);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            req.body.id_utilizator = req.user.id;
            await MedicalHolidaysService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }   
};