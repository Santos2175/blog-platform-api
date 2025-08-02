import { Types } from 'mongoose';

// Represents shape of comment object used during creation
export interface IComment {
  content: string;
  post: Types.ObjectId;
  author: Types.ObjectId;
}

// Represents shape of comment object used during API response
export interface ICommentResponse extends IComment {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
