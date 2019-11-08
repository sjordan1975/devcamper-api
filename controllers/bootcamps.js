import Bootcamp from '../models/Bootcamp';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, data: { msg: 'Show all bootcamps' } });
};

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
export const getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { msg: `Show bootcamp with id ${req.params.id}` }
  });
};

// @desc Update a single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
export const updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { msg: `Update bootcamp with id ${req.params.id}` }
  });
};

// @desc Delete a single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
export const deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { msg: `Delete bootcamp with id ${req.params.id}` }
  });
};

// @desc Create a bootcamp
// @route POST /api/v1/bootcamps
// @access Private
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
