import { DocumentsService } from "./documents.service";
export const DocumentsController = {
    
    async getAll(req, res, next) { 
        try {
            const data = await DocumentsService.getAllDocuments();
            res.send(data);
        } catch (error) {
            next({ message: "Error fetching documents", error });
        }
    },

    async create(req, res) { 
        const newDocument = await DocumentsService.createDocument(req.body);
        res.send(newDocument); 
    },

    async getById(req, res) { 
        const document = await DocumentsService.getDocumentById(req.params.id);
        res.send(document); 
    },

    async update(req, res) { 
        const updatedDocument = await DocumentsService.updateDocument(req.params.id, req.body);
        res.send(updatedDocument); 
    },

    async delete(req, res) { 
        const deletedDocument = await DocumentsService.deleteDocument(req.params.id);
        res.send(deletedDocument); 
    }
};