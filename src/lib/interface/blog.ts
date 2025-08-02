import { Types } from 'mongoose';

// Represents shape of blog object used during creation
export interface IBlog {
  title: string;
  description: string;
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

// Pick only fields: title, description from IBlog
// Represents shape for the client input
export interface IBlogInput extends Pick<IBlog, 'title' | 'description'> {
  tags?: string[];
}

// Represents the shape of blog query params
export interface BlogQueryParams {
  author?: string;
  tag?: string;
  search?: string;
  sortBy?: 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
