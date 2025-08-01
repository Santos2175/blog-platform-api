import { Schema, model } from 'mongoose';
import { IUser } from '../lib/interface/user';

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
  },
  { timestamps: true }
);

// User model for communicating with db
export const User = model('User', userSchema);
