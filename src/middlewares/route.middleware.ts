import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

// Undefined route handling middleware
export const undefinedRouteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new ApiError(`Route ${req.originalUrl} not found`, 404);
};
