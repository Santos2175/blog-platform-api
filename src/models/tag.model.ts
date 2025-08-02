import { model, Schema } from 'mongoose';
import { ITag, TagStatus } from '../lib/interface/tags';

// Tag Schema definition
const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: TagStatus,
      default: TagStatus.PENDING,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Customize JSON serialization: remove unnecessary field
// '__v' before sending the tag object in API responses
tagSchema.set('toJSON', {
  transform: function (_doc, ret: Record<string, any>) {
    delete ret.__v;
    return ret;
  },
});

// Tag model to communicate to the database
export const Tag = model('Tag', tagSchema);
