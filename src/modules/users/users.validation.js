// src/modules/users/users.validation.js
import Joi from "joi";

export const createUserSchema = Joi.object({
  nume_complet: Joi.string().trim().min(3).required(),
  email: Joi.string().trim().email().required(),
  parola_hash: Joi.string().min(4).required(), // plain password input on create
  activ: Joi.boolean().optional()
});

export const updateUserSchema = Joi.object({
  nume_complet: Joi.string().trim().min(3).optional(),
  email: Joi.string().trim().email().optional(),
  parola_hash: Joi.string().min(4).optional(), // plain password input on update
  activ: Joi.boolean().optional()
});
