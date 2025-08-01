import { isValidObjectId } from 'mongoose';
import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';

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
}

export const blogService = new BlogService();
