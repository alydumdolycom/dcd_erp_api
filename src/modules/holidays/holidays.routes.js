import { HolidaysController  } from './holidays.controller.js';   
import { Router } from 'express';

const router = Router();
router.get('/', HolidaysController.getAll);
router.get('/:id', HolidaysController.getById);
router.post('/', HolidaysController.create);
router.patch('/:id', HolidaysController.update);
router.delete('/:id', HolidaysController.delete);
router.get('/reports/holday/payment', HolidaysController.reportCoPaymentHolidaySum);

export default router;
