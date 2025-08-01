import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';
import { IBlog } from '../lib/interface/blog';
import { AuthenticatedRequest } from '../lib/interface/request';

class BlogController {
  /**
   * @route       GET /api/v1/blogs/
   * @access      Public
   * @description Handles getting all the blogs
   */
  public async getAllBlogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const blogs = await blogService.getAllBlogs();

      res.status(200).json({
        success: true,
        message: 'Blogs retrieved successfully',
        data: { blogs },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       GET /api/v1/blogs/:blogId
   * @access      Public
   * @description Handles getting blog by id
   */
  public async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const blogId = req.params.blogId;
      const blog = await blogService.getBlogById(blogId);

      res.status(200).json({
        success: true,
        message: 'Blog retrieved successfully',
        data: { blog },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       POST /api/v1/blogs/
   * @access      Private
   * @description Handles new blog creation
   */
  public async createBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const blogData: IBlog = req.body;

      const blog = await blogService.createBlog(blogData, userId!);

      res.status(200).json({
        success: true,
        message: 'Blog created successfully',
        data: { blog },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
