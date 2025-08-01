import { IUser, IUserResponse } from '../lib/interface/user';
import { comparePassword, hashPassword } from '../lib/utils/password';
import { generateAccessToken, generateRefreshToken } from '../lib/utils/token';
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

  // Login user with email and password
  public async login(userData: Pick<IUser, 'email' | 'password'>) {
    // Check if user exists
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      throw new ApiError('Invalid Credentials', 400);
    }

    // Check credentials
    const isMatch = await comparePassword(userData.password, user.password);

    if (!isMatch) {
      throw new ApiError('Invalid Credentials', 400);
    }

    const payload = {
      _id: user._id.toString(),
      email: user.email,
    };

    // Generate access and refresh token
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }
}

export const authService = new AuthService();
