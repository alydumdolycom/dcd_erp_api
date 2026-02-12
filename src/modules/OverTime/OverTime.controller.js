import { OverTimeService } from "./OverTime.service.js";

export const OverTimeController = {
    async getAll(req, res, next) {
        try {
            const data = await OverTimeService.getAll(req.query.id_firma);
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            next(error);
        }   
    },

    async getById(req, res, next) {
        try {   
            const data = await OverTimeService.getById(req.params.id);
            res.status(200).json({
                success: true,
                data: data    
            });
        } catch (err) {
            next({
                success: false,
                message: err.message
            });
        }
    },

    async create(req, res, next) {
        try {
            const data = await OverTimeService.create(req.body);
            res.status(201).json({
                success: true,
                data: data
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await OverTimeService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {  
        try {
            await OverTimeService.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: "OverTime deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
};