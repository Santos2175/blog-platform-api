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
      const { user, otp } = await authService.register(userData);

      if (!user) {
        throw new ApiError('User registration failed', 400);
      }

      res.status(201).json({
        success: true,
        message: 'Verification code sent. Please verify your email',
        data: {
          user,
          otp,
        },
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
}

export const authController = new AuthController();
