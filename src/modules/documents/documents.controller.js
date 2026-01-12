import { DocumentsService } from "./documents.service.js";

export const DocumentsController = {
<<<<<<< HEAD
    
    async getAll(req, res, next) { 
=======
    async getAll(req, res, next) {
        const id_firma = req.query.id_firma || req.params.id_firma;
>>>>>>> 77fff1e (update)
        try {
            const data = await DocumentsService.getAll(id_firma);
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
    }
};