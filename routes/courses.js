import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  deleteCourses
} from '../controllers/courses';

import Course from '../models/Course';
import { advancedResults } from '../middleware/advancedResults';

const router = express.Router({ mergeParams: true });

// Protect middleware
import { protect, authorize } from '../middleware/auth';

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), createCourse)
  .delete(deleteCourses); //@TODO This is a temporary convenience

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export { router as courses };
