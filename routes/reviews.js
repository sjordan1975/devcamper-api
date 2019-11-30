import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  deleteReviews
} from '../controllers/reviews';

import Review from '../models/Review';

const router = express.Router({ mergeParams: true });

// Middleware
import { protect, authorize } from '../middleware/auth';
import { advancedResults } from '../middleware/advancedResults';

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), createReview)
  .delete(deleteReviews); //@TODO This is a temporary convenience

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

export { router as reviews };
