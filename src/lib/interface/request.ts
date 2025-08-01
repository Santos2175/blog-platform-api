import { TokenPayload } from './token';
import { Request } from 'express';

// Extending request to inclue req.user too
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
