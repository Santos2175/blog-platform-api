import Router from 'express';
import { authenticate } from '../middlewares/authenticate.middleware';
import { tagController } from '../controllers/tag.controller';
import { authorize } from '../middlewares/authorize.middleware';

// Router initialization
const router = Router();

// Tag API routes
router.route('/').post(authenticate, tagController.findOrCreateTag);

router
  .route('/:tagId')
  .patch(authenticate, authorize(['ADMIN']), tagController.approveTag);

export default router;
