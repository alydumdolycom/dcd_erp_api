
import { addError } from "../../utils/validators.js";
import { CompaniesModel } from "./companies.model.js";

export const CompaniesService = {
  async getAll({ search, sortBy, filters }) {
 // Business rules can live here
    return CompaniesModel.all({ search, sortBy, filters });
  },
  async create(data) {
    const errors = {};

    // Validate required fields
    if (!data.nume) addError(errors, "nume", "Numele este obligatoriu");
    if (!data.cif) addError(errors, "cif", "cif este obligatoriu");
    if (data.nume) {
        const existing = await CompaniesModel.find(data.nume);
        if (existing) addError(errors, "nume", "Firma deja exista");
    }
    // Check if CUI already exists
    if (data.cif) {
        const existing = await CompaniesModel.findByCif(data.cif);
        if (existing) addError(errors, "cif", "CIF-ul există deja");
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    return CompaniesModel.create(data);
  },

  async getById(id) {
    return CompaniesModel.findById(id);
  },

  async update(id, data) {
    return CompaniesModel.update(id, data);
  },

  async delete(id) {
    await CompaniesModel.delete(id);
  }
};