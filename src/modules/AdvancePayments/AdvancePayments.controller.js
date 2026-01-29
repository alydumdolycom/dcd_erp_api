import { AdvancePaymentsService } from "./AdvancePayments.service.js";

export const AdvancePaymentsController = {
    async getAll(req, res, next) {
        try {
            const data = await AdvancePaymentsService.getAll(req.query.id_firma);
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            next({
                success: false,
                message: error.message
            });
        }
    },

    async update(req, res, next) {
        try {
            const data = await AdvancePaymentsService.update(req.params.id, req.body);
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            next({
                success: false,
                message: error.message
            });
        }
    },
    
    async getById(req, res, next) {
        try {
            const id = req.params.id;   
            const data = await AdvancePaymentsService.getById(id);
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            next({
                success: false,
                message: error.message
            });
        }
    }
};