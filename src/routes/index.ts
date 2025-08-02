import Router from 'express';
import authRoutes from '../routes/auth.route';
import blogRoutes from '../routes/blog.route';
import commentRoutes from '../routes/comment.route';

// Initialize router
const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);

export default router;
