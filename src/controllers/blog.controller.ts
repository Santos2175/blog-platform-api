import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';
import { BlogQueryParams, IBlog } from '../lib/interface/blog';
import { AuthenticatedRequest } from '../lib/interface/request';

export class BlogController {
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
      const queryData: BlogQueryParams = req.query;

      const { data, page, limit, total, totalPages } =
        await blogService.getAllBlogs(queryData);

      res.status(200).json({
        success: true,
        message: 'Blogs retrieved successfully',
        data: { blogs: data, page, limit, total, totalPages },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       GET /api/v1/blogs/:userId/blogs
   * @access      Public
   * @description Handles retrieving blogs of particular user
   */
  public async getBlogsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;

      const blogs = await blogService.getBlogsByUser(userId);

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
   * @route       GET /api/v1/blogs/my-blogs
   * @access      Private
   * @description Handles retrieving blogs of authenticated user
   */
  public async getMyBlogs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;

      const blogs = await blogService.getMyBlogs(userId!);

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
      const role = req.user?.role;
      const blogData = req.body;

      const blog = await blogService.createBlog(blogData, userId!, role!);

      res.status(200).json({
        success: true,
        message: 'Blog created successfully',
        data: { blog },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       PATCH /api/v1/blogs/:blogId
   * @access      Private
   * @description Handle blog update for authenticated user
   */
  public async updateBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const blogId = req.params.blogId;
      const blogData = req.body;

      const updatedBlog = await blogService.updateBlog(
        blogData,
        blogId,
        userId!
      );

      res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        data: { updatedBlog },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       DELETE /api/v1/blogs/:blogId
   * @access      Private
   * @description Handles blog deletion by id for authenticated user
   */
  public async deleteBlogById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const blogId = req.params.blogId;

      await blogService.deleteBlogById(blogId, userId!);

      res
        .status(200)
        .json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
