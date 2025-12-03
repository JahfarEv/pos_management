import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().optional().allow(""),
  isActive: Joi.boolean().optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  description: Joi.string().optional().allow(""),
  isActive: Joi.boolean().optional(),
});
