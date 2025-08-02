import { isValidObjectId } from 'mongoose';
import { ITag, TagStatus } from '../lib/interface/tags';
import { Tag } from '../models/tag.model';
import { ApiError } from '../middlewares/error.middleware';

export class TagService {
  // Find tag or create a new one if it does not exist
  public async findOrCreateTag(
    TagData: Pick<ITag, 'name'>,
    userId: string,
    role: string
  ): Promise<{ tag: ITag; isNewlyCreated: boolean }> {
    const normalized = TagData.name.trim().toLowerCase();

    // Check if tag already exists to avoid dubplicate tag creation
    let tag = await Tag.findOne({ name: normalized });

    if (tag) return { tag, isNewlyCreated: false };

    const status = role === 'admin' ? TagStatus.APPROVED : TagStatus.PENDING;

    tag = new Tag({
      name: normalized,
      status,
      createdBy: userId,
    });

    await tag.save();

    return { tag, isNewlyCreated: true };
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
}

export const tagService = new TagService();
