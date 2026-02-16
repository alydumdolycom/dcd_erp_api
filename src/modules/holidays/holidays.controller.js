import { HolidaysService } from './holidays.service.js';

/* Controller for managing holidays */
export const HolidaysController = {

    /* Get all holidays with optional filters */
    async getAll(req, res, next) {
        const { id_firma, id_departament, nume, prenume, an, luna } = req.query;
        try {
            const rows = await HolidaysService.getAll({ id_firma, id_departament, nume, prenume, an, luna });
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        }
    },

    /* Get holiday by ID */
    async getById(req, res, next) {
        try {
            const row = await HolidaysService.getById(req.params.id);
            if (!row) {
            return res.status(404).json({ message: 'Informatiile nu au fost gasite' });
            }
            res.status(200).json(row);
        } catch (error) {
            next(error);
        }
    },

    /* Create a new holiday */
    async create(req, res, next) {  
        try {
            const result = await HolidaysService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }   
    },

    /* Update an existing holiday */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await HolidaysService.update(id, req.body);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }   

    },

    /* Delete a holiday */
    async delete(req, res, next) {  
        try {
            const { id } = req.params;
            await HolidaysService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async reportCoPaymentHolidaySum(req, res, next) {
        try {
            const { id_firma, an, luna, id_modplata } = req.query;
            const result = await HolidaysService.reportCoPaymentHolidaySum(id_firma, an, luna, id_modplata);
            res.status(200).json({
               data: result
            });
        } catch (error) {
            next(error);
        }   
    }
};