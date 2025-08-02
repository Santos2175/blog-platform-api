import { Schema, model } from 'mongoose';
import { IUser, UserRole } from '../lib/interface/user';

// User schema definition
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      role: UserRole,
      default: UserRole.USER,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Customize JSON serialization: remove sensitive or unnecessary fields
// like 'password' and '__v' before sending the user object in API responses
userSchema.set('toJSON', {
  transform: function (_doc, ret: Record<string, any>) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// User model for communicating with db
export const User = model('User', userSchema);
