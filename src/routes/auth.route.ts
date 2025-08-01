import Router from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate.middleware';

// Router initialization
const router = Router();

// Auth API routes
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').post(authenticate, authController.logout);

export default router;
