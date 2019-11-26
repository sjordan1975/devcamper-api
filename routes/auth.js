import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
} from '../controllers/auth';

const router = express.Router();

// Protect middleware
import { protect } from '../middleware/auth';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export { router as auth };
