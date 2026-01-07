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

    }
}; 