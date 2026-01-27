import { PayRollService } from './payroll.service.js';
export const PayRollController = {

    async getAll(req, res, next) {
        // Logic to get all payroll records
        try {
            const data = await PayRollService.getAll(req.query.id_firma);
            if(!data) {
                return res.status(404).json({
                    success: false,
                    message: "Informatiile despre salarii nu au fost gasite"
                });
            }
            res.status(200).json({
                success: true,
                data: data
            });

        } catch (err) {
            next({
                status: 500,    
                message: "A aparut o eroare la incarcarea listei de salarii",
                details: err.message
            });
        }
    },

    async getById(req, res, next) {
        // Logic to get a payroll record by ID
        try { 
            const data = await PayRollService.getById(req.params.id);
            if(!data) {
                return res.status(404).json({
                    success: false,
                    message: "Informatiile despre salarii nu au fost gasite"
                });
            }
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) { 
            next({
                status: 500,    
                message: "A aparut o eroare la incarcarea detaliilor salariului",
                details: err.message
            });
        }
    },

    async create(req, res, next) {
        // Logic to create a new payroll record
        try {
            const result = await PayRollService.create(req.body);
        } catch (err) {
            next({
                status: 500,    
                message: "A aparut o eroare la crearea unui nou salariu",
                details: err.message
            });
        }   
    },

    async update(req, res, next) {
        // Logic to update a payroll record by ID
        try {
            const result = await PayRollService.update(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Informatiile despre salariu nu au fost gasite pentru actualizare"
                });
            }
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            next({
                status: 500,    
                message: "A aparut o eroare la actualizarea detaliilor salariului",
                details: err.message
            });
        }
    },

    async delete(req, res, next) {
        // Logic to delete a payroll record by ID
        try {
            const result = await PayRollService.delete(req.params.id);
            return result;
        } catch (err) {
            next({
                status: 500,    
                message: "A aparut o eroare la stergerea detaliilor salariului",
                details: err.message
            });
        }
    },

    async getPayrollByDays(req, res, next) {
        // Logic to get payroll by days
        try {   
            const data = await PayRollService.getPayrollByDays(req.query.id_firma);
            if(!data) {
                return res.status(404).json({
                    success: false,
                    message: "Informatiile despre salarii nu au fost gasite"
                });
            }
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) { 
            next({
                status: 500,    
                message: "A aparut o eroare la incarcarea detaliilor salariului",
                details: err.message
            });
        }
    }
};