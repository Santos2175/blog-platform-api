import Router from 'express';
import { blogController } from '../controllers/blog.controller';

// Router initialization
const router = Router();

// Blog API routes
router.route('/').get(blogController.getAllBlogs);
router.route('/:blogId').get(blogController.getBlogById);

export default router;
