import { MedicalHolidaysService } from './MedicalHolidays.service.js';

export const MedicalHolidaysController = {

    async getAll(req, res, next) {
        try {
            const data = await MedicalHolidaysService.getAll(req.query.id_firma);
            
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
            const data = await MedicalHolidaysService.getById(req.params.id);
            if (!data) {
                return res.status(404).json({
                    success: false,     
                    message: 'Concediul medical nu a fost găsit'
                });
            }   
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }   
    },

    async create(req, res, next) {
        try {
            // Validate data.cod_indemnizatie is not null
            if (req.body.cod_indemnizatie) {
                // validare cod_indemnizatie si cnp_copil trebuie sa fie required si valid
                if (req.body.cod_indemnizatie === '91' || req.body.cod_indemnizatie === '09') {
                    if (!req.body.cnp_copil) {
                        return res.status(400).json({
                            success: false,
                            message: 'cnp_copil este obligatoriu pentru cod_indemnizatie 91 sau 09'
                        });
                    }   
                } else {
                    req.body.cnp_copil = null;
                }

                if(req.body.cod_indemnizatie === '06') {
                    if( !req.body.cod_urgenta) {
                        return res.status(400).json({
                            success: false,
                            message: 'cod_urgenta este obligatoriu pentru cod_indemnizatie 06'
                        });
                    }
                } else {
                    req.body.cod_urgenta = null;
                }
            }
            req.body.id_utilizator = req.user.id;
            const data = await MedicalHolidaysService.create(req.body);
            if (data.success === false) {
                return res.status(409).json({
                    success: false, 
                    message: data.message
                });
            }
            res.status(201).json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            req.body.id_utilizator = req.user.id;
            const data = await MedicalHolidaysService.update(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Concediul medical nu a fost găsit'
                });
            }
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const result = await MedicalHolidaysService.delete(req.params.id);
            if(result === null) {
                return res.status(404).json({
                    success: false,
                    message: 'Concediul medical nu a fost găsit'
                });
            }
            res.status(204).send({
                success: true
            });
        } catch (error) {
            next({
                status: 500,
                message: 'Eroare server la ștergerea concediului medical',
                error
            });
        }
    },

    async getMedicalData(req, res, next) {
        try {
            const nom_medical_data = await MedicalHolidaysService.getNomMedicalData();
            const nom_medical_prescription = await MedicalHolidaysService.getMedicalPrescription();
            res.status(200).json({
                success: true,
                nom_medical_data,
                nom_medical_prescription
            });
        } catch (error) {
            next(error);
        }
    }
};