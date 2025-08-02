import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Represents shape of user object used during creation
export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
}

// Represents shape of user object used during API response
export interface IUserResponse extends IUser, Document {
  _id: string | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
