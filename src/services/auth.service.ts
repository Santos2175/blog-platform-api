import e from 'express';
import { OTP_TYPE } from '../lib/interface/Otp';
import { IUser } from '../lib/interface/user';
import { generateOtp, getOtpExpiry } from '../lib/utils/otp';
import { comparePassword, hashPassword } from '../lib/utils/password';
import { sendEmail } from '../lib/utils/sendEmail';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../lib/utils/token';
import { ApiError } from '../middlewares/error.middleware';
import { Otp } from '../models/Otp.model';
import { User } from '../models/user.model';

export class AuthService {
  // Register new user with hashed password
  public async register(userData: IUser): Promise<void> {
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

    // Generate Otp code and its expiry time
    const otp = generateOtp();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000;

    await Otp.create({
      email: userData.email,
      otp,
      expiresAt: otpExpiresAt,
      type: OTP_TYPE.EMAIL_VERIFICATION,
    });

    await user.save();

    // Send email
    sendEmail({
      to: user.email,
      subject: 'Email Verification',
      type: 'emailVerification',
      context: {
        fullName: user.fullName,
        otp,
      },
    });

    // return { user, otp };
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new ApiError('Email not verified. Please verify your email', 400);
    }

    const payload = {
      _id: user._id.toString(),
      role: user.role,
    };

    // Generate access and refresh token
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  // Logout user and clear the refreshToken
  public async logout(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.refreshToken = undefined;
    await user.save();
  }

  // Verify email
  public async verifyEmail(otp: string): Promise<void> {
    // Check opt for validity
    const emailVerificationOtp = await Otp.findOne({
      otp,
      type: OTP_TYPE.EMAIL_VERIFICATION,
      expiresAt: { $gt: Date.now() },
      verified: false,
    });

    if (!emailVerificationOtp) {
      throw new ApiError('Invalid or expired verification otp', 400);
    }

    // Find the user linked with this otp
    const user = await User.findOne({ email: emailVerificationOtp.email });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.isEmailVerified = true;
    await user.save();

    // Mark OTP as used
    emailVerificationOtp.verified = true;
    await emailVerificationOtp.save();

    // Delete all other unused email_verification OTPs for the user
    await Otp.deleteMany({
      email: user.email,
      type: OTP_TYPE.EMAIL_VERIFICATION,
      verified: false,
    });
  }

  // Resend otp based for email_verification or reset-password
  public async resendOtp(email: string, type: OTP_TYPE): Promise<void> {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // If type==='EMAIL_VERIFICATION', check if already verified
    if (type === OTP_TYPE.EMAIL_VERIFICATION && user.isEmailVerified) {
      throw new ApiError('Email already verified', 400);
    }

    // @todo: add rate limiting for requesting otp

    // Delete old unverified OTPs of this type
    await Otp.deleteMany({
      email,
      type,
      verified: false,
    });

    // Generate and save new OTP
    const otp = generateOtp();
    const expiresAt = getOtpExpiry(type);

    await Otp.create({
      email,
      otp,
      type,
      expiresAt,
      verified: false,
    });

    // Send email
    sendEmail({
      to: user.email,
      subject:
        type === OTP_TYPE.EMAIL_VERIFICATION
          ? 'Email Verification'
          : 'Reset Password Request',
      type:
        type === OTP_TYPE.EMAIL_VERIFICATION
          ? 'emailVerification'
          : 'passwordResetRequest',
      context: {
        fullName: user.fullName,
        otp,
      },
    });
  }

  // Send otp for password reset
  public async forgotPassword(email: string): Promise<void> {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // @todo: add rate limiting for resend

    // Remove previous unverified otps
    await Otp.deleteMany({
      email,
      type: OTP_TYPE.RESET_PASSWORD,
      verified: false,
    });

    // Generate otp and save
    const otp = generateOtp();
    const expiresAt = getOtpExpiry(OTP_TYPE.RESET_PASSWORD);

    await Otp.create({
      email,
      otp,
      type: OTP_TYPE.RESET_PASSWORD,
      expiresAt,
      verified: false,
    });

    // Send email
    sendEmail({
      to: user.email,
      subject: 'Reset Password Request',
      type: 'passwordResetRequest',
      context: {
        fullName: user.fullName,
        otp,
      },
    });
  }

  // Resetting the password from otp of type RESET_PASSWORD
  public async resetPassword(
    otp: string,
    email: string,
    newPassword: string
  ): Promise<void> {
    // Check if otp exists for email
    const otpDoc = await Otp.findOne({
      email,
      otp,
      type: OTP_TYPE.RESET_PASSWORD,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpDoc) {
      throw new ApiError('Invalid or expired OTP', 400);
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Update user's password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();

    otpDoc.verified = true;
    await otpDoc.save();

    // Cleanup unused otp
    await Otp.deleteMany({
      email,
      type: OTP_TYPE.RESET_PASSWORD,
      verified: false,
    });
  }

  // Generate access token from refresh token
  public async verifyRefreshTokenAndGenerateAccessToken(
    refreshToken: string
  ): Promise<string> {
    // Verify refresh token
    const payload = verifyToken(refreshToken, 'refresh');

    if (!payload) {
      throw new ApiError('Invalid refresh token', 401);
    }

    const user = await User.findById(payload._id);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
    });

    return accessToken;
  }
}

export const authService = new AuthService();
