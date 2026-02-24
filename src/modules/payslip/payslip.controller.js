import { PayslipService } from "./payslip.service.js";

export const PayslipController = {
    async getAll(req, res, next) {
        try {
            const data = await PayslipService.getAll();  
            res.status(200).json({ 
                success: true,
                data: data
            });
        } catch (error) {
            next({
                status: 500,
                success: false,
                error: error.message || "Eroare server"
            });
        }   
    },

    async findBy(req, res, next) {
        try {
            const { luna, anul, id_firma } = req.query; 
            const data = await PayslipService.findBy(luna, anul, id_firma);  
            res.status(200).json({ 
                success: true,
                data: data
            });
        } catch (error) {
            next({
                status: 500,
                success: false,
                error: error.message || "Eroare server"
            });
        }
    }
};