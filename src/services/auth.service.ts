import { IUser, IUserResponse } from '../lib/interface/user';
import { hashPassword } from '../lib/utils/password';
import { ApiError } from '../middlewares/error.middleware';
import { User } from '../models/user.model';

export class AuthService {
  // Register new user with hashed password
  public async register(userData: IUser) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new ApiError('Email already in use', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create and save user
    const user = new User({
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword,
    });

    await user.save();

    return user;
  }
}

export const authService = new AuthService();
