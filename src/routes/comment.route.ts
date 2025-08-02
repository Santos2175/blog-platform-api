import Router from 'express';
import { authenticate } from '../middlewares/authenticate.middleware';
import { commentController } from '../controllers/comment.controller';

// Router initialization
const router = Router();

// Comment API routes
router
  .route('/:blogId')
  .post(authenticate, commentController.addComment)
  .get(commentController.getCommentsByBlog);

export default router;
