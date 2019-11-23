import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create uer
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  res.status(200).json({
    success: true
  });
});
