import Router from 'express';
import { authenticate } from '../middlewares/authenticate.middleware';
import { tagController } from '../controllers/tag.controller';
import { authorize } from '../middlewares/authorize.middleware';
import { validateInput } from '../middlewares/validateInput.middleware';
import { tagInputSchema } from '../validators/tag.validator';

// Router initialization
const router = Router();

// Tag API routes
router
  .route('/')
  .post(
    authenticate,
    authorize(['ADMIN', 'USER']),
    validateInput(tagInputSchema),
    tagController.findOrCreateTag
  );

router
  .route('/:tagId')
  .patch(authenticate, authorize(['ADMIN']), tagController.approveTag)
  .delete(authenticate, authorize(['ADMIN']), tagController.deleteTag);

export default router;
