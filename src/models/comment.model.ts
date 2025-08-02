import { Schema, model } from 'mongoose';
import { IComment } from '../lib/interface/comment';

// Comment Schema definition
const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Customize JSON serialization: remove unnecessary field
// '__v' before sending the comment object in API responses
commentSchema.set('toJSON', {
  transform: function (_doc, ret: Record<string, any>) {
    delete ret.__v;
    return ret;
  },
});

// Comment model to communicate with db
export const Comment = model('Comment', commentSchema);
