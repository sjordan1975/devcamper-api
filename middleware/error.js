export const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).json({
    success: false,
    error: err.message
  });
  next();
};
