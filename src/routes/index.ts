import Router from 'express';
import authRoutes from '../routes/auth.route';

// Initialize router
const router = Router();

// API routes
router.use('/auth', authRoutes);

export default router;
