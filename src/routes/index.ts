import Router from 'express';
import authRoutes from '../routes/auth.route';
import blogRoutes from '../routes/blog.route';
import commentRoutes from '../routes/comment.route';
import tagRoutes from '../routes/tag.route';

// Initialize router
const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/tags', tagRoutes);

export default router;
