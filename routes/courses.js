import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  deleteCourses
} from '../controllers/courses';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getCourses)
  .post(createCourse)
  .delete(deleteCourses); //@TODO This is a temporary convenience

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

export { router as courses };
