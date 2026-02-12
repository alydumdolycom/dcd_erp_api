import { OverTimeModel } from "./OverTime.model.js";

export const OverTimeService = {
    async getAll(id_firma) {
        const result =  await OverTimeModel.all(id_firma);
        return result;
    },

    async getById(id) {
        const result =  await OverTimeModel.getById(id);
        return result;
    },

    async create(data) {
        const result =  await OverTimeModel.create(data);
        return result;
    },

    async update(id, data) {
        const result =  await OverTimeModel.update(id, data);
        return result;
    },

    async delete(id) {
        const result =  await OverTimeModel.delete(id);
        return result;
    }
};