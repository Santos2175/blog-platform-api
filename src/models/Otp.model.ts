import { model, Schema } from 'mongoose';
import { IOtp, OTP_TYPE } from '../lib/interface/Otp';

// Otp schema definition
const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: OTP_TYPE,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// TTL index to auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Otp model to communicate to db
export const Otp = model<IOtp>('Otp', OtpSchema);
