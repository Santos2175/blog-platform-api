import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { IUser } from '../lib/interface/user';
import { ApiError } from '../middlewares/error.middleware';
import { AuthenticatedRequest } from '../lib/interface/request';

export class AuthController {
  /**
   * @route       POST /api/v1/auth/register
   * @access      Public
   * @description Handles user registration
   */
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: IUser = req.body;

      await authService.register(userData);

      res.status(201).json({
        success: true,
        message:
          'Verification code sent to your email. Please verify your email',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/auth/login
   * @access      Public
   * @description Handles user login
   */
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: Pick<IUser, 'email' | 'password'> = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        userData
      );

      res
        .status(200)
        .json({ success: true, data: { user, accessToken, refreshToken } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method      POST /api/v1/auth/logout
   * @access      Private
   * @description Handles user logout
   */
  public async logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      await authService.logout(userId!);

      res
        .status(200)
        .json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/auth/verify-email
   * @access      Public
   * @description Handles email verification
   */
  public async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { otp } = req.body;

      await authService.verifyEmail(otp);

      res
        .status(200)
        .json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/auth/resend-otp
   * @access      Public
   * @description Handles resend otp based on type
   */
  public async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, type } = req.body;

      await authService.resendOtp(email, type);

      res.status(200).json({
        success: true,
        message: `OTP sent. Please check your mail to verify it`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/auth/forgot-password
   * @access      Public
   * @description Handles sending otp code for password reset
   */
  public async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      await authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Password reset OTP sent. Please check your email',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/auth/reset-password
   * @access      Public
   * @description Handles reset password by checking otp validity
   */
  public async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { otp, newPassword, email } = req.body;

      await authService.resetPassword(otp, email, newPassword);

      res
        .status(200)
        .json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/auth/refresh
   * @access      Public
   * @description Handles generation of access token from refresh token
   */
  public async verifyRefreshTokenAndGenerateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // There is better way to send refresh token more securely. For now
      // it is being sent through request body
      const { refreshToken } = req.body;

      const accessToken =
        await authService.verifyRefreshTokenAndGenerateAccessToken(
          refreshToken
        );

      res.status(200).json({
        success: true,
        message: 'Access token generated',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
