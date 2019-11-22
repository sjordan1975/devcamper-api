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

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(createCourse)
  .delete(deleteCourses); //@TODO This is a temporary convenience

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

export { router as courses };
