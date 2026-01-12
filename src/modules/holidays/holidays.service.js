import { HolidaysModel } from "./holidays.model.js";

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

    async create(holidayData) {
        // Logic to create a new holiday
        const newHoliday = await HolidaysModel.create(holidayData);
        return newHoliday;
    },

    async update(id, holidayData) {
        // Logic to update an existing holiday
        const updatedHoliday = await HolidaysModel.update(id, holidayData);
        return updatedHoliday;
    },
    async delete(id) {
        // Logic to delete a holiday
        await HolidaysModel.delete(id);
    }   
};