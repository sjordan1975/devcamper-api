import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth';

const router = express.Router();

// Protect middleware
import { protect } from '../middleware/auth';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export { router as auth };
