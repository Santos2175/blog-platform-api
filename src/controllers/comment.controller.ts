import { Response, Request, NextFunction } from 'express';
import { AuthenticatedRequest } from '../lib/interface/request';
import { commentService } from '../services/comment.service';

export class CommentController {
  /**
   * @route       POST /api/v1/comments/
   * @access      Private
   * @description Handles adding comment to particular blog
   */
  public async addComment(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const blogId = req.params.blogId;
      const commentData = req.body;

      const comment = await commentService.addComment(
        commentData,
        blogId,
        userId!
      );

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       GET /api/v1/comments/:blogId
   * @access      Public
   * @description Handles getting comments for a specific blog
   */
  public async getCommentsByBlog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const blogId = req.params.blogId;
      const comments = await commentService.getCommentsByBlog(blogId);

      res.status(200).json({
        success: true,
        message: 'Comments retrieved successfully',
        data: { comments },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       PATCH /api/v1/comments/:commentId
   * @access      Private
   * @description Handles editing comment for authenticated user
   */
  public async editComment(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const commentId = req.params.commentId;
      const commentData = req.body;

      const editedComment = await commentService.editComment(
        commentData,
        commentId,
        userId!
      );

      res.status(200).json({
        success: true,
        message: 'Comment edited successfully',
        data: { editedComment },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       DELETE /api/v1/comments/:commentId
   * @access      Private
   * @description Handles comment deletion done by authenticated user
   */
  public async deleteComment(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const commentId = req.params.commentId;

      await commentService.deleteComment(commentId, userId!);

      res
        .status(200)
        .json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
