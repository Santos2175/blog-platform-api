import { Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';
import { verifyToken } from '../lib/utils/token';
import { TokenPayload } from '../lib/interface/token';
import { AuthenticatedRequest } from '../lib/interface/request';

// Middleware to check and verify token for authentication
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authorization token missing', 401);
    }

    // Extract token and check if it is present
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError('Token not provided', 401);
    }

    const decoded = verifyToken(token) as TokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}
