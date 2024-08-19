const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .optional(),
}).or("name", "email", "phone");

module.exports = {
  contactSchema,
  updateContactSchema,
};
