import { UserModel } from "../users/users.model.js";
import { DocumentsModel } from "./documents.model.js";

export const DocumentsService = {
    async getAll({ id_firma, id_departament, search }) {
        // Logic to get all documents
        const rows = await DocumentsModel.all({ id_firma, id_departament, search });    
        return rows;
    },

    async create(data) {
        // Logic to create a document
        const rows = await DocumentsModel.create(data);
        return rows;
    },

    async getById(id) {
        // Logic to get a document by ID
        const rows = await DocumentsModel.findById(id);
        return rows;
    },

    async update(id, data) {
        // Logic to update a document
        const rows = await DocumentsModel.update(id, data);
        return rows;
    },

    async delete(id) {  
        // Logic to delete a document
        await DocumentsModel.delete(id);
    },

    async getEmployeeDocs(id_employee) {
        // Logic to get documents for a specific employee
        const rows = await DocumentsModel.findByEmployeeId(id_employee);
        return rows;
    }
};