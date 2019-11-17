import express from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  deleteBootcamps
} from '../controllers/bootcamps';

// Include other resource routers
import { courses as courseRouter } from './courses';

const router = express.Router();

// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp)
  .delete(deleteBootcamps); //@TODO This is a temporary convenience

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export { router as bootcamps };
