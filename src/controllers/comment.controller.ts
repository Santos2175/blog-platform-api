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
}

export const commentController = new CommentController();
