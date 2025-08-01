import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { TokenPayload } from '../interface/token';
import { ApiError } from '../../middlewares/error.middleware';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// Generate access token
export const generateAccessToken = (user: TokenPayload): string => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Generate refresh token
export const generateRefreshToken = (user: TokenPayload): string => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Decode and verify token
export const verifyToken = (
  token: string,
  type: 'access' | 'refresh' = 'access'
): TokenPayload => {
  try {
    const secret =
      type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ApiError('Token has expired', 401);
    }

    if (error instanceof JsonWebTokenError) {
      throw new ApiError('Invalid token', 401);
    }

    throw new ApiError('Token verification failed', 401);
  }
};
