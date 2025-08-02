import Joi from 'joi';

// Schema validation for adding comment
export const addCommentSchema = Joi.object({
  content: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 3 characters long',
    'string.max': 'Content cannot exceed 100 characters',
    'any.required': 'Content is required',
  }),
});

// Schema validation for edit comment
export const editCommentSchema = Joi.object({
  content: Joi.string().trim().min(3).max(100).optional().messages({
    'string.base': 'Content must be a string',
    'string.min': 'Content must be at least 3 characters long',
    'string.max': 'Content cannot exceed 100 characters',
  }),
});
