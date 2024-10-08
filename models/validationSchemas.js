const Joi = require("joi");
const mongoose = require("mongoose");

const idSchema = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID format");
  }
  return value;
});

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

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.string().valid("starter", "pro", "business");

const updateSubscriptionSchema = Joi.object({
  subscription: subscriptionSchema.required(),
});

module.exports = {
  idSchema,
  contactSchema,
  updateContactSchema,
  userSchema,
  updateSubscriptionSchema,
};
