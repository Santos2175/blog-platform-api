import { isValidObjectId, Types } from 'mongoose';
import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';
import { IBlog } from '../lib/interface/blog';

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
}

export const blogService = new BlogService();
