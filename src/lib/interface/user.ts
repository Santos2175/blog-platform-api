// Represents shape of user object used during creation
export interface IUser {
  fullName: string;
  email: string;
  password: string;
}

// Represents shape of user object used during API response
export interface IUserResponse extends IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
