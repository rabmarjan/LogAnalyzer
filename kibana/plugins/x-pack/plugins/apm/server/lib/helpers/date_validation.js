import Joi from 'joi';
export const dateValidation = Joi.alternatives()
  .try(Joi.date().iso(), Joi.number())
  .required();
