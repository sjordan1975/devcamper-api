import Course from '../models/Course';
import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamp/:bootcampId/courses
// @access Public
export const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @desc Update a single course
// @route PUT /api/v1/courses/:id
// @access Private
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    new ErrorResponse(`Course not found with id ${req.params.id}`, 404);
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: course });
});

// @desc Delete a single course
// @route DELETE /api/v1/courses/:id
// @access Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    new ErrorResponse(`Course not found with id ${req.params.id}`, 404);
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc Delete all courses
// @route DELETE /api/v1/courses
// @access Private
export const deleteCourses = asyncHandler(async (req, res, next) => {
  const deletedCount = await Course.remove({});

  res.status(200).json({ success: true, data: { deletedCount } });
});

// @desc Create a course
// @route POST /api/v1/bootcamp/:bootcampId/courses
// @access Private
export const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  // Add user to req.body
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    new ErrorResponse(`Course not found with id ${req.params.bootcampId}`, 404);
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Unauthorized`, 401));
  }

  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});
