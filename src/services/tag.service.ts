import { ITag, TagStatus } from '../lib/interface/tags';
import { Tag } from '../models/tag.model';

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
}

export const tagService = new TagService();
