import Router from 'express';
import { authenticate } from '../middlewares/authenticate.middleware';
import { tagController } from '../controllers/tag.controller';

// Router initialization
const router = Router();

// Tag API routes
router.route('/').post(authenticate, tagController.findOrCreateTag);

export default router;
