import Joi from 'joi';

// Schema validation for user registration
export const userRegisterSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(20).required().messages({
    'string.base': 'Full name must be a string',
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters long',
    'string.max': 'Full name cannot exceed 20 characters',
    'any.required': 'Full name is required',
  }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string().trim().min(6).max(20).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 20 characters',
    'any.required': 'Password is required',
  }),
});

// Schema validation for user login
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string().trim().min(6).max(20).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 20 characters',
    'any.required': 'Password is required',
  }),
});

// Schema validation for verify email
export const verifyEmailSchema = Joi.object({
  otp: Joi.string().trim().length(6).required().messages({
    'string.base': 'OTP must be a string',
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be exactly 6 digits',
    'any.required': 'OTP is required',
  }),
});

// Schema validation for resend otp
export const resendOtpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),

  type: Joi.string()
    .valid('EMAIL_VERIFICATION', 'RESET_PASSWORD')
    .required()
    .messages({
      'any.only':
        'OTP type must be either "EMAIL_VERIFICATION" or "RESET_PASSWORD"',
      'any.required': 'OTP type is required',
    }),
});

// Schema validation for forgot password
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
});

// Schema validation for reset password
export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),

  otp: Joi.string().trim().length(6).required().messages({
    'string.base': 'OTP must be a string',
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be exactly 6 digits',
    'any.required': 'OTP is required',
  }),

  newPassword: Joi.string().trim().min(6).max(20).required().messages({
    'string.base': 'New password must be a string',
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
    'string.max': 'New password cannot exceed 20 characters',
    'any.required': 'New password is required',
  }),
});
