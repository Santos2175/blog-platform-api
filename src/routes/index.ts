import Router from 'express';
import authRoutes from '../routes/auth.route';
import blogRoutes from '../routes/blog.route';

// Initialize router
const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);

export default router;
