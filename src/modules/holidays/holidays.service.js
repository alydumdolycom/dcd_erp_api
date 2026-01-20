import { HolidaysModel } from "./holidays.model.js";
import { EmployeesModel } from "../employees/employees.model.js";

/*  
    Holidays Service
*/
export const HolidaysService = {
   
    /*  Get All Holidays */
    async getAll({ id_firma, id_departament, nume, prenume, an, luna }) {
        const rows = await HolidaysModel.all({ id_firma, id_departament, nume, prenume, an, luna });
        return rows;
    },

    /*  Get Holiday By ID */
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

    /*  Create New Holiday */
    async create(data) {
        // Logic to create a new holiday
        const rows = await HolidaysModel.create(data);
        return rows[0];
    },

    /*  Update Existing Holiday */
    async update(id, data) {
        // Logic to update an existing holiday
        const rows = await HolidaysModel.update(id, data);
        return rows[0];
    },

    /*  Delete Holiday */
    async delete(id) {
        // Logic to delete a holiday
        await HolidaysModel.delete(id);
    }   
};