import Router from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateInput } from '../middlewares/validateInput.middleware';
import {
  forgotPasswordSchema,
  resendOtpSchema,
  resetPasswordSchema,
  userLoginSchema,
  userRegisterSchema,
  verifyEmailSchema,
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

router
  .route('/verify-email')
  .post(validateInput(verifyEmailSchema), authController.verifyEmail);

router
  .route('/resend-otp')
  .post(validateInput(resendOtpSchema), authController.resendOtp);

router
  .route('/forgot-password')
  .post(validateInput(forgotPasswordSchema), authController.forgotPassword);

router
  .route('/reset-password')
  .post(validateInput(resetPasswordSchema), authController.resetPassword);

router
  .route('/refresh')
  .post(authController.verifyRefreshTokenAndGenerateAccessToken);

export default router;
