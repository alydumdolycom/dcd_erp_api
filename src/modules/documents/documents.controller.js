import { DocumentsService } from "./documents.service.js";

export const DocumentsController = {
    
    async getAll(req, res, next) { 
        try {
            const { id_firma, id_departament, search } = req.query;
            const data = await DocumentsService.getAll({ id_firma, id_departament, search });
            res.send({
                data,
                message: "Informatii acte aditionale obtinute cu succes",
                code: 200
            });
        } catch (error) {
            next({ message: "Error fetching documents", error });
        }
    },

    async create(req, res) { 
        const data = await DocumentsService.create(req.body);
        res.send({
            data,
            message: "Act aditional creat cu succes",
            code: 201
        });
    },

    async getById(req, res) { 
        const data = await DocumentsService.getById(req.params.id);
        res.send({
            data,
            message: "Act aditional obtinut cu succes",
            code: 200
        });
    },

    async update(req, res) { 
        const data = await DocumentsService.update(req.params.id, req.body);
        res.send({
            data,
            message: "Act aditional actualizat cu succes",
            code: 200
        });
    },

    async delete(req, res) { 
        await DocumentsService.delete(req.params.id);
        res.status(204).send();
    },

    async getEmployeeDocs(req, res, next) { 
        try {
            const data = await DocumentsService.getEmployeeDocs(req.params.id_employee);
            res.send(data);
        } catch (error) {
            next({ message: "Error fetching employee documents", error });
        }   
    }
};