import express from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  deleteBootcamps,
  uploadBootcampPhoto
} from '../controllers/bootcamps';

import Bootcamp from '../models/Bootcamp';
import { advancedResults } from '../middleware/advancedResults';

// Include other resource routers
import { courses as courseRouter } from './courses';

const router = express.Router();

// Protect middleware
import { protect, authorize } from '../middleware/auth';

// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp)
  .delete(deleteBootcamps); //@TODO This is a temporary convenience

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

export { router as bootcamps };
