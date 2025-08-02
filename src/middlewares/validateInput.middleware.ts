import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ApiError } from './error.middleware';

// Middleware for input validation
export const validateInput = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // format the errors
      const formattedErrors = error.details.map((detail) => {
        const message = detail.message.replace(/['"]/g, '');
        return message.charAt(0).toUpperCase() + message.slice(1);
      });

      // pass the errors to global error handler
      next(new ApiError(formattedErrors, 400));
    }

    // if there are no errors, pass the req inputs to next middleware function
    next();
  };
};
