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
    
    async getById(req, res, next) {  
        try {
            const { id } = req.params;  
            const data = await PayslipService.getById(id);  
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