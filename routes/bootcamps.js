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

// Include other resource routers
import { courses as courseRouter } from './courses';
import { reviews as reviewRouter } from './reviews';

const router = express.Router();

// Middleware
import { protect, authorize } from '../middleware/auth';
import { advancedResults } from '../middleware/advancedResults';

// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

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
