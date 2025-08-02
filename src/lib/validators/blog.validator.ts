import Joi from 'joi';

// Blog input schema for validation
export const blogInputSchema = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 50 characters',
    'any.required': 'Title is required',
  }),

  description: Joi.string().trim().min(10).max(1000).required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 10 characters long',
    'string.max': 'Content cannot exceed 1000 characters',
    'any.required': 'Content is required',
  }),

  tags: Joi.array().items(Joi.string().trim()).default([]).messages({
    'array.base': 'Tags must be an array of strings',
  }),
});

// Schema for blog update validation
export const blogUpdateSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 50 characters',
      'string.base': 'Title must be a string',
    })
    .optional(),

  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .messages({
      'string.min': 'Content must be at least 10 characters long',
      'string.max': 'Content cannot exceed 1000 characters',
      'string.base': 'Content must be a string',
    })
    .optional(),

  tags: Joi.array()
    .items(Joi.string().trim())
    .messages({
      'array.base': 'Tags must be an array of strings',
      'string.base': 'Each tag must be a string',
    })
    .optional(),
});
