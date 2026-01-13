import { HolidaysService } from './holidays.service.js';

export const HolidaysController = {
    async getAll(req, res, next) {
        try {
            const holidays = await HolidaysService.getAll();
            res.status(200).json(holidays);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const holiday = await HolidaysService.getById(id);
            res.status(200).json(holiday);
        } catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {  
        try {
            const newHoliday = await HolidaysService.create(req.body);
            res.status(201).json(newHoliday);
        } catch (error) {
            next(error);
        }   
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const holidayData = req.body;
            const updatedHoliday = await HolidaysService.update(id, holidayData);
            res.status(200).json(updatedHoliday);
        }
        catch (error) {
            next(error);
        }   

    },

    async delete(req, res, next) {  
        try {
            const { id } = req.params;
            await HolidaysService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};