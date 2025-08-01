import Router from 'express';
import { authController } from '../controllers/auth.controller';

// Router initialization
const router = Router();

// Auth API routes
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

export default router;
