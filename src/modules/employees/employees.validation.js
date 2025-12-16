import Joi from "joi";

export const createEmployeeSchema = {
  body: Joi.object({
    nume: Joi.string().min(2).required(),
    prenume: Joi.string().min(2).required(),
    functie: Joi.string().min(2).required()
  })
};
