import { Types } from 'mongoose';

export enum TagStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Represents shape of tag object used during creation
export interface ITag {
  name: string;
  status: TagStatus;
  createdBy: Types.ObjectId;
}

// Represents shape of tag object used during API response
export interface ITagResponse extends ITag {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
