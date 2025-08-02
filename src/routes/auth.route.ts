import Router from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateInput } from '../middlewares/validateInput.middleware';
import {
  userLoginSchema,
  userRegisterSchema,
} from '../lib/validators/user.validator';

// Router initialization
const router = Router();

// Auth API routes
router
  .route('/register')
  .post(validateInput(userRegisterSchema), authController.register);

router
  .route('/login')
  .post(validateInput(userLoginSchema), authController.login);

router.route('/logout').post(authenticate, authController.logout);

router.route('/verify-email').post(authController.verifyEmail);

router.route('/resend-otp').post(authController.resendOtp);

router.route('/forgot-password').post(authController.forgotPassword);

export default router;
