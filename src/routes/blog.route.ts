import Router from 'express';
import { blogController } from '../controllers/blog.controller';
import { authenticate } from '../middlewares/authenticate.middleware';

// Router initialization
const router = Router();

// Blog API routes
router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(authenticate, blogController.createBlog);

router.route('/my-blogs').get(authenticate, blogController.getMyBlogs);

router
  .route('/:blogId')
  .get(blogController.getBlogById)
  .patch(authenticate, blogController.updateBlog);

router.route('/:userId/blogs').get(blogController.getBlogsByUser);

export default router;
