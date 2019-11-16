import Bootcamp from '../models/Bootcamp';
import ErrorResponse from '../utils/errorResponse';
import geocoder from '../utils/geocoder';
import { asyncHandler } from '../middleware/async';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort'];

  // Loop over removeFields and delete from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Find resource
  let query = Bootcamp.find(JSON.parse(queryStr));

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

  // Executing query
  const bootcamps = await query;
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Update a single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete a single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc Create a bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zip/:distance
// @access Private
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);

  // Get lat/lng from geocoder
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth radius 3,963.2 miles or 6,378.1 kilometers
  const radius = distance / 3963.2; // default to miles

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
