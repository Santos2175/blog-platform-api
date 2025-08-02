import { isValidObjectId, Types } from 'mongoose';
import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';
import { IBlog } from '../lib/interface/blog';
import { User } from '../models/user.model';

export class BlogService {
  // Get all the blogs
  public async getAllBlogs() {
    const blogs = await Blog.find();

    return blogs;
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

  // Create new blog
  public async createBlog(blogData: Omit<IBlog, 'author'>, userId: string) {
    const authorId = new Types.ObjectId(userId);

    // Check if particular user has the blog with the new title already
    const blogExists = await Blog.findOne({
      title: blogData.title,
      author: authorId,
    });

    if (blogExists) {
      throw new ApiError('You already have a blog with this title', 409);
    }

    const blog = new Blog({
      title: blogData.title,
      content: blogData.content,
      author: authorId,
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
    const { title, content } = blogData;

    if (typeof title === 'string') blog.title = title;
    if (typeof content === 'string') blog.content = content;

    await blog.save();

    return blog;
  }
}

export const blogService = new BlogService();
