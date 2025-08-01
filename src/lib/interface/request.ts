import { TokenPayload } from './token';

// Extending request to inclue req.user too
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
