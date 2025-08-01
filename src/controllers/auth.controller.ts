import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { IUser, IUserResponse } from '../lib/interface/user';
import { ApiError } from '../middlewares/error.middleware';

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
      const user = await authService.register(userData);

      if (!user) {
        throw new ApiError('User registration failed', 400);
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
