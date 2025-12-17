import Joi from "joi";

export const createEmployeeSchema = {
  body: Joi.object({
    id_firma: Joi.number().integer().required(),

    nume: Joi.string().min(2).max(100).required(),
    prenume: Joi.string().min(2).max(100).required(),

    cnp: Joi.string()
      .length(13)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": "CNP must be exactly 13 digits",
        "string.pattern.base": "CNP must contain only digits"
      }),

    prod_tesa: Joi.string()
      .length(1)
      .valid("P", "T")
      .required(),

    sex: Joi.string()
      .length(1)
      .valid("M", "F")
      .required(),

    id_functie: Joi.number().integer().required(),
    id_tip_contract: Joi.number().integer().required(),
    id_ore_norma: Joi.number().integer().required(),
    id_departament: Joi.number().integer().required(),
    id_judet_cass: Joi.number().integer().required(),

    data_angajarii: Joi.date().required(),
    data_incetarii: Joi.date().allow(null),
    data_determinata: Joi.date().allow(null),

    nr_contract: Joi.string().max(30).required(),
    data_contract: Joi.date().required(),

    salar_baza: Joi.number().precision(0).required(),
    salar_net: Joi.number().precision(0).required(),

    spor_vechime: Joi.number().min(0).max(99).required(),
    vechime: Joi.number().precision(2).required(),

    pensionar: Joi.boolean().default(false),
    scutit_impozit: Joi.boolean().default(false),
    intrerupere: Joi.boolean().default(false),
    are_garantie: Joi.boolean().default(false),

    garantie_plafon: Joi.number().precision(2).allow(null),
    garantie_luna: Joi.number().precision(2).allow(null),

    telefon: Joi.string().max(30).allow(null, ""),
    email: Joi.string().email().max(100).allow(null, ""),

    localitate: Joi.string().max(100).allow(null, ""),
    judet: Joi.string().max(50).allow(null, ""),
    strada: Joi.string().max(100).allow(null, ""),
    nr: Joi.string().max(10).allow(null, ""),
    bloc: Joi.string().max(10).allow(null, ""),
    scara: Joi.string().max(10).allow(null, ""),
    etaj: Joi.string().max(10).allow(null, ""),
    ap: Joi.string().max(10).allow(null, ""),
    sector: Joi.string().max(10).allow(null, ""),
    cod_postal: Joi.string().max(10).allow(null, ""),

    pers_deducere: Joi.number().integer().min(0).default(0),

    observatii: Joi.string().max(200).allow(null, "")
  })
};
