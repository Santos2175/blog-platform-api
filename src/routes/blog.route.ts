import Router from 'express';
import { blogController } from '../controllers/blog.controller';

// Router initialization
const router = Router();

// Blog API routes
router.route('/').get(blogController.getAllBlogs);

export default router;
