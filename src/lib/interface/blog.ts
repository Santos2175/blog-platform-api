import { Types } from 'mongoose';

// Represents shape of blog object used during creation
export interface IBlog {
  title: string;
  content: string;
  author: Types.ObjectId;
  comments?: Types.ObjectId[];
  tags?: Types.ObjectId[];
}

// Represents shape of user object used during API response
export interface IBlogResponse extends IBlog {
  _id: Types.ObjectId;
  createdAt: Date;
  updated: Date;
}

// Pick only fields: title,content from IBlog
// Represents shape for the client input
export interface IBlogInput extends Pick<IBlog, 'title' | 'content'> {
  tags?: string[];
}
