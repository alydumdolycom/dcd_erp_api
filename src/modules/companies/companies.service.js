
import { CompaniesModel } from "./companies.model.js";

export const CompaniesService = {
  async getAllPaginated({page,
    limit,
    search,
    sortBy,
    sortOrder,
    filters}) {
 // Business rules can live here
    if (limit > 100) {
      limit = 100; // hard limit protection
    }

    return CompaniesModel.all({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filters
    });
  },
  async create(data) {
    const errors = {};

    // Validate required fields
    if (!data.denumire) addError(errors, "denumire", "Denumirea este obligatorie");
    if (!data.cui) addError(errors, "cui", "CUI este obligatoriu");
    if (data.nume) {
        const existing = await CompaniesModel.find(data.nume);
        if (existing) addError(errors, "nume", "Firma deja exista");
    }
    // Check if CUI already exists
    if (data.cui) {
        const existing = await CompaniesModel.findByCui(data.cui);
        if (existing) addError(errors, "cui", "CUI-ul există deja");
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }
      return CompaniesModel.create(data);
  },
};