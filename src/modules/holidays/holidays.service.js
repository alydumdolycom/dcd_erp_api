import { HolidaysModel } from "./holidays.model.js";
import { EmployeesModel } from "../employees/employees.model.js";

export const HolidaysService = {
    async getAll() {
        // Logic to retrieve all holidays
        const holidays = await HolidaysModel.all();
        return holidays;
    },

    async getById(id) {
        // Logic to retrieve a holiday by ID
        const holiday = await HolidaysModel.findById(id);
        return holiday;   
    },

    async create(data) {
        // Logic to create a new holiday
        const holiday = await HolidaysModel.create(data);
        return holiday;
    },

    async update(id, data) {
        // Logic to update an existing holiday
        const updatedHoliday = await HolidaysModel.update(id, data);
        return updatedHoliday;
    },
    async delete(id) {
        // Logic to delete a holiday
        await HolidaysModel.delete(id);
    }   
};