import Joi from 'joi';

// Schema validation for tag input
export const tagInputSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required().messages({
    'string.base': 'tag name must be a string',
    'string.empty': 'tag name is required',
    'string.min': 'tag name must be at least 3 characters long',
    'string.max': 'tag name cannot exceed 20 characters',
    'any.required': 'tag name is required',
  }),
});
