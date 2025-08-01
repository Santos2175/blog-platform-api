import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';

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
}

export const blogController = new BlogController();
