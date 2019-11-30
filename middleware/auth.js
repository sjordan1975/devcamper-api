import jwt from 'jsonwebtoken';
import { asyncHandler } from './async';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/User';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //@TODO Uncomment the following when using cookies
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    return next(new ErrorResponse('Unauthorized', 401));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('Unauthorized', 401));
  }
});

// Grant access to priviledged roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Unauthorized user ${req.user.id} with role ${req.user.role}`,
          403
        )
      );
    }
    next();
  };
};
