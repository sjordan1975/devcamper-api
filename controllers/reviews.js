import Review from '../models/Review';
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';

// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamp/:bootcampId/reviews
// @access Public
export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc GET a review
// @route GET /api/v1/reviews/:Id
// @access Public
export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: review });
});

// @desc Update a review
// @route PUT /api/v1/reviews/:Id
// @access Private
export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    new ErrorResponse(`Review not found with id ${req.params.id}`, 404);
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: review });
});

// @desc Delete a review
// @route DELETE /api/v1/reviews/:Id
// @access Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    new ErrorResponse(`Review not found with id ${req.params.id}`, 404);
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc Create a review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
export const createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  // Add user to req.body
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

// @desc Delete all reviews
// @route DELETE /api/v1/reviews
// @access Private
export const deleteReviews = asyncHandler(async (req, res, next) => {
  const deletedCount = await Review.remove({});

  res.status(200).json({ success: true, data: { deletedCount } });
});
