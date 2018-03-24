import Joi from 'joi';

export const userSchema = {
  username: Joi.string().required(),
  password: Joi.string(),
  roles: Joi.array().items(Joi.string()),
  full_name: Joi.string().allow(null, ''),
  email: Joi.string().allow(null, ''),
  metadata: Joi.object(),
  enabled: Joi.boolean().default(true)
};
