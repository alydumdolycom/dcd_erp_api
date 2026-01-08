import { PaymentsService } from "./payments.service.js";

export const PaymentsController = {
    async getAll(req, res, next) {
        // Logic to retrieve all payments
      try {
        const data =  await PaymentsService.getAll();
        res.status(200).json({
          success: true,
          data: data
        });
      } catch (err) {
        next({
          status: 500,
          message: "Eroare server",
          details: err.message
        });
      }
    },

    async create(req, res, next) {
        // Logic to create a new payment
      try { 
        const data = await PaymentsService.create(req.body);
        res.status(201).json({
          success: true,
          data: data
        });
      } catch (err) {
        next({
          status: 500,
          message: "Eroare server",
          details: err.message
        });
      } 
    },

    async update(req, res, next) {  
        // Logic to update an existing payment
      try {
        const data = await PaymentsService.update(req.params.id, req.body);
        res.status(200).json({
          success: true,
          data: data
        });
      } catch (err) {
        next({
          status: 500,
          message: "Eroare server",
          details: err.message
        });
      } 
    },

    async delete(req, res, next) {  
        // Logic to delete a payment
      try {
        await PaymentsService.delete(req.params.id);  
        res.status(200).json({
          success: true,
          message: "Informatiile au fost actualizate"
        });
      } catch (err) {
        next({
          status: 500,
          message: "Eroare server",
          details: err.message
        });
      }
    }
}; 