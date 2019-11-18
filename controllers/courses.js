import Course from '../models/Course';
import ErrorResponse from '../utils/errorResponse';
import { asyncHandler } from '../middleware/async';

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamp/:bootcampId/courses
// @access Public
export const getCourses = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Find resource
  let query;
  const conditions = JSON.parse(queryStr);
  if (req.params.bootcampId) {
    conditions.bootcamp = req.params.bootcampId;
  }

  query = Course.find(conditions).populate('bootcamp');

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Course.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Paginaion result
  const pagination = { total };

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  // Executing query
  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    pagination,
    data: courses
  });
});

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

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
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!course) {
    new ErrorResponse(`Course not found with id ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: course });
});

// @desc Delete a single course
// @route DELETE /api/v1/courses/:id
// @access Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    new ErrorResponse(`Course not found with id ${req.params.id}`, 404);
  }
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
// @route POST /api/v1/courses
// @access Private
export const createCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});
