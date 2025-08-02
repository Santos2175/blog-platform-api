import { isValidObjectId, Types } from 'mongoose';
import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';
import { BlogQueryParams, IBlog, IBlogInput } from '../lib/interface/blog';
import { User } from '../models/user.model';
import { tagService } from './tag.service';
import {
  getEmptyPaginatedResult,
  PaginatedResponse,
} from '../lib/utils/pagination';
import { Tag } from '../models/tag.model';

export class BlogService {
  // Get all the blogs
  public async getAllBlogs(
    query: BlogQueryParams
  ): Promise<PaginatedResponse<any>> {
    const {
      author,
      tag,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const pageOffset: number = (page - 1) * limit;

    // Initialize record filter for searching
    const filter: Record<string, any> = {};

    // Extract author id from query string
    if (author) {
      const cleanedAuthor = author.replace(/%/g, ' ');

      const authorDoc = await User.findOne({
        fullName: { $regex: cleanedAuthor, $options: 'i' },
      });

      if (!authorDoc) {
        return getEmptyPaginatedResult(page, limit);
      }

      filter.author = new Types.ObjectId(authorDoc._id);
    }

    // Extract tag id from query tag string
    if (tag) {
      const tagDoc = await Tag.findOne({ name: new RegExp(`^${tag}$`, 'i') });

      if (!tagDoc) {
        return getEmptyPaginatedResult(page, limit);
      }

      filter.tags = { $in: [tagDoc._id] };
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Set sort order
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const blogs = await Blog.find(filter)
      .populate('author', 'fullName email')
      .populate('tags', 'name')
      .sort(sortOptions)
      .skip(pageOffset)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(filter);

    return {
      data: blogs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get blog by id
  public async getBlogById(blogId: string) {
    // Check if blogId is valid object id
    if (!isValidObjectId(blogId)) {
      throw new ApiError('Invalid blogId', 400);
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    return blog;
  }

  // Get blogs belonging to particular user
  public async getBlogsByUser(userId: string): Promise<IBlog | IBlog[]> {
    // Check if user id is valid
    if (!isValidObjectId(userId)) {
      throw new ApiError('Invalid userId', 400);
    }

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    return blogs;
  }

  // Get blogs for authenticated user
  public async getMyBlogs(userId: string): Promise<IBlog | IBlog[]> {
    const blogs = await Blog.find({ author: userId }).sort({ created: -1 });

    return blogs;
  }

  // Create new blog
  public async createBlog(blogData: IBlogInput, userId: string, role: string) {
    const authorId = new Types.ObjectId(userId);

    // Check if particular user has the blog with the new title already
    const blogExists = await Blog.findOne({
      title: blogData.title,
      author: authorId,
    });

    if (blogExists) {
      throw new ApiError('You already have a blog with this title', 409);
    }

    // Prepare tags and add to blog
    let tagIds: Types.ObjectId[] = [];

    if (blogData.tags && blogData.tags.length > 0) {
      for (const tagName of blogData.tags) {
        const { tag } = await tagService.findOrCreateTag(
          { name: tagName },
          userId!,
          role
        );
        tagIds.push(tag._id);
      }
    }

    const blog = new Blog({
      title: blogData.title,
      description: blogData.description,
      author: authorId,
      tags: tagIds,
    });

    await blog.save();

    return blog;
  }

  // Update specific blog belonging to authenticated user
  public async updateBlog(
    blogData: Partial<IBlog>,
    blogId: string,
    userId: string
  ): Promise<IBlog> {
    // Check if blog id is valid
    if (!Types.ObjectId.isValid(blogId)) {
      throw new ApiError('Invalid blog ID', 400);
    }

    // Check if blog exists for a particular user
    const blog = await Blog.findOne({ _id: blogId, author: userId });

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    // Update blog
    const { title, description } = blogData;

    if (typeof title === 'string') blog.title = title;
    if (typeof description === 'string') blog.description = description;

    await blog.save();

    return blog;
  }

  // Delete blog by id for authenticated user only
  public async deleteBlogById(blogId: string, userId: string): Promise<void> {
    // Check if blog id is valid
    if (!isValidObjectId(blogId)) {
      throw new ApiError('Invalid blog id', 400);
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    await Blog.deleteOne({ _id: blogId, author: userId });
  }
}

export const blogService = new BlogService();
