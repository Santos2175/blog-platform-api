import Router from 'express';
import { authenticate } from '../middlewares/authenticate.middleware';
import { commentController } from '../controllers/comment.controller';
import { validateInput } from '../middlewares/validateInput.middleware';
import {
  addCommentSchema,
  editCommentSchema,
} from '../validators/comment.validator';

// Router initialization
const router = Router();

// Comment API routes
router
  .route('/:blogId')
  .post(
    authenticate,
    validateInput(addCommentSchema),
    commentController.addComment
  )
  .get(commentController.getCommentsByBlog);

router
  .route('/:commentId')
  .patch(
    authenticate,
    validateInput(editCommentSchema),
    commentController.editComment
  )
  .delete(authenticate, commentController.deleteComment);

export default router;
