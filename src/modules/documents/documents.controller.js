import { DocumentsService } from "./documents.service.js";

export const DocumentsController = {
    
    async getAll(req, res, next) { 
        try {
            const data = await DocumentsService.getAll(req.params.id_firma, req.query);
            res.send(data);
        } catch (error) {
            next({ message: "Error fetching documents", error });
        }
    },

    async create(req, res) { 
        const data = await DocumentsService.create(req.body);
        res.send(data); 
    },

    async getById(req, res) { 
        const data = await DocumentsService.getById(req.params.id);
        res.send(data); 
    },

    async update(req, res) { 
        const data = await DocumentsService.update(req.params.id, req.body);
        res.send(data); 
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