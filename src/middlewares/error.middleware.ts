import { ErrorRequestHandler } from 'express';

// Custom error class to standardize error structure
export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(message: string | string[], statusCode: number) {
    const messages = Array.isArray(message) ? message : [message];
    super(messages.join(', '));

    this.statusCode = statusCode;
    this.errors = messages;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global api error-handling middleware
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next
) => {
  const statusCode = err.statusCode || 500;
  const messageArray = err.errors || [err.message || 'Internal Server Error'];

  res.status(statusCode).json({
    success: false,
    message: messageArray.length === 1 ? messageArray[0] : messageArray,
  });
};
