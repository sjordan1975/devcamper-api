import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users';

import User from '../models/User';

const router = express.Router();

// Middleware
import { advancedResults } from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .delete(deleteUser)
  .put(updateUser)
  .get(getUser);

export { router as users };
