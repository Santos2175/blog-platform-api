import { NextFunction } from 'express';
import { AuthenticatedRequest } from '../lib/interface/request';
import { ApiError } from './error.middleware';

// Middleware to check permission for certain role
export const authorize = (allowedRoles?: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;

      if (!user) throw new ApiError('Unauthorized', 401);

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        throw new ApiError('Forbidden: Permission Denied', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
