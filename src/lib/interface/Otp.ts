import { Types } from 'mongoose';

// Enum type for otp_type
export enum OTP_TYPE {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

// Represents the object structure of otp during creation
export interface IOtp {
  email: string;
  otp: string;
  type: OTP_TYPE;
  expiresAt: Date;
  vefified: boolean;
}

// Represents the shape of otp structure used during API response
export interface IOtpResponse {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
