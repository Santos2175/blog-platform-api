import Router from 'express';
import { blogController } from '../controllers/blog.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateInput } from '../middlewares/validateInput.middleware';
import {
  blogInputSchema,
  blogUpdateSchema,
} from '../validators/blog.validator';

// Router initialization
const router = Router();

// Blog API routes
router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    authenticate,
    validateInput(blogInputSchema),
    blogController.createBlog
  );

router.route('/my-blogs').get(authenticate, blogController.getMyBlogs);

router
  .route('/:blogId')
  .get(blogController.getBlogById)
  .patch(
    authenticate,
    validateInput(blogUpdateSchema),
    blogController.updateBlog
  )
  .delete(authenticate, blogController.deleteBlogById);

router.route('/:userId/blogs').get(blogController.getBlogsByUser);

export default router;
