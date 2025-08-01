import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';

export class BlogService {
  // Get all the blogs
  public async getAllBlogs() {
    const blogs = await Blog.find();

    return blogs;
  }
}

export const blogService = new BlogService();
