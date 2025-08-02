import { isValidObjectId, Types } from 'mongoose';
import { ITag, ITagResponse, TagStatus } from '../lib/interface/tags';
import { Tag } from '../models/tag.model';
import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';
import { UserRole } from '../lib/interface/user';

export class TagService {
  // Find tag or create a new one if it does not exist
  public async findOrCreateTag(
    TagData: Pick<ITag, 'name'>,
    userId: string,
    role: string
  ): Promise<{ tag: ITagResponse; isNewlyCreated: boolean }> {
    const normalized = TagData.name.trim().toLowerCase();

    // Check if tag already exists to avoid dubplicate tag creation
    let tag = await Tag.findOne({ name: normalized });

    if (tag) {
      // Convert to plain object and assert type
      const plainTag = tag.toObject() as unknown as ITagResponse;
      return { tag: plainTag, isNewlyCreated: false };
    }

    const status =
      role === UserRole.ADMIN ? TagStatus.APPROVED : TagStatus.PENDING;

    tag = new Tag({
      name: normalized,
      status,
      createdBy: userId,
    });

    await tag.save();

    // Convert to plain object and assert type
    const plainTag = tag.toObject() as unknown as ITagResponse;

    return { tag: plainTag, isNewlyCreated: true };
  }

  // Approve the tag requested by author
  public async approveTag(tagId: string): Promise<ITag> {
    // Check validity of tag id
    if (!isValidObjectId(tagId)) {
      throw new ApiError('Invalid tag id', 400);
    }

    // Check if tag is present
    const tag = await Tag.findById(tagId);

    if (!tag) {
      throw new ApiError('Tag not found', 404);
    }

    // Check if tag is already approved
    if (tag.status === TagStatus.APPROVED) {
      throw new ApiError('Tag is already approved', 400);
    }

    tag.status = TagStatus.APPROVED;

    await tag.save();

    return tag;
  }

  // Delete tag: only allowed for admin
  public async deleteTag(tagId: string): Promise<void> {
    // Check validity of tag id
    if (!isValidObjectId(tagId)) {
      throw new ApiError('Invalid tag id', 400);
    }

    // Check if tag is present and delete it
    const deleted = await Tag.findByIdAndDelete(tagId);

    if (!deleted) {
      throw new ApiError('Tag not found', 404);
    }

    // Remove tag reference from all blogs
    await Blog.updateMany(
      { tags: new Types.ObjectId(tagId) },
      { $pull: { tags: new Types.ObjectId(tagId) } }
    );
  }
}

export const tagService = new TagService();
