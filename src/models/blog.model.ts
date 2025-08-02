import { Schema, model } from 'mongoose';
import { IBlog } from '../lib/interface/blog';

// Blog schema definition
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  { timestamps: true }
);

// Compound indexing for faster searching blogs by certain author
blogSchema.index({ author: 1, createdAt: -1 });

// Customize JSON serialization: remove unnecessary field
// '__v' before sending the blog object in API responses
blogSchema.set('toJSON', {
  transform: function (_doc, ret: Record<string, any>) {
    delete ret.__v;
    return ret;
  },
});

// Blog model for communicating to db
export const Blog = model('Blog', blogSchema);
