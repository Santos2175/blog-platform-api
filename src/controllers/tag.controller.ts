import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../lib/interface/request';
import { tagService } from '../services/tag.service';

export class TagController {
  /**
   * @route       POST /api/v1/tags
   * @access      Public
   * @description Handle tag reuse or tag creation
   */
  public async findOrCreateTag(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      const role = req.user?.role;
      const tagData = req.body;

      const { tag, isNewlyCreated } = await tagService.findOrCreateTag(
        tagData,
        userId!,
        role!
      );

      const message = isNewlyCreated
        ? role === 'ADMIN'
          ? 'Tag created successfully.'
          : 'Tag created and submitted for admin approval.'
        : 'Tag already exists and has been reused.';

      res.status(200).json({ success: true, message, data: { tag } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       PATCH /api/v1/tags/:tagId
   * @access      Private
   * @description Handles tag approval by admin
   */
  public async approveTag(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tagId = req.params.tagId;

      const tag = await tagService.approveTag(tagId);

      res
        .status(200)
        .json({ success: true, message: 'Tag approved', data: { tag } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route       DELETE /api/v1/tags/:tagId
   * @access      Private
   * @description Handles tag deletion: Only for admin
   */
  public async deleteTag(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tagId = req.params.tagId;

      await tagService.deleteTag(tagId);

      res
        .status(200)
        .json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const tagController = new TagController();
