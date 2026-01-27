import { addError } from "../../utils/validators.js";
import { CompaniesModel } from "./companies.model.js";

/*
  Companies Service
*/
export const CompaniesService = {
  
  /* Get all companies with optional search, sorting, and filtering */
  async getAll({ search, sortBy, filters }) {
    return CompaniesModel.all({ search, sortBy, filters });
  },

  /* Create a new company with validation */
  async create(data) {
    const errors = {};

    // Validate required fields
    if (!data.nume) addError(errors, "nume", "Numele este obligatoriu");
    if (!data.cif) addError(errors, "cif", "cif este obligatoriu");
    if (data.nume) {
        const existing = await CompaniesModel.find(data.nume);
        if (existing) addError(errors, "nume", "Firma deja exista");
    }

    if(data.id_modplatarea > 1 && !data.cont_bancar) {
      addError(errors, "id_modplata", "Obligatoriu cont bancar");
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

  /* Get a company by its ID */
  async getById(id) {
    return CompaniesModel.findById(id);
  },

  /* Update an existing company */
  async update(id, data) {
    return CompaniesModel.update(id, data);
  },

  /* Delete a company by its ID */
  async delete(id) {
    await CompaniesModel.delete(id);
  }
};