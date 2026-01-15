import { HolidaysModel } from "./holidays.model.js";
import { EmployeesModel } from "../employees/employees.model.js";

export const HolidaysService = {
    async getAll() {
        // Logic to retrieve all holidays
        const rows = await HolidaysModel.all();
        return rows;
    },

    async getById(id) {
        // Logic to retrieve a holiday by ID
        try {
            const row = await HolidaysModel.findById(id);
            if (!row) {
                return null;
            }
            return row;
        } catch (error) {
            throw new Error('Error retrieving holiday by ID: ' + error.message);
        }
    },

    async create(data) {
        // Logic to create a new holiday
        const rows = await HolidaysModel.create(data);
        return rows[0];
    },

    async update(id, data) {
        // Logic to update an existing holiday
        const rows = await HolidaysModel.update(id, data);
        return rows[0];
    },

    async delete(id) {
        // Logic to delete a holiday
        await HolidaysModel.delete(id);
    }   
};