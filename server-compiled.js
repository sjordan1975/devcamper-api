"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _morgan = _interopRequireDefault(require("morgan"));

var _error = require("./middleware/error");

var _db = require("./config/db");

var _bootcamps = require("./routes/bootcamps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Load env vars
_dotenv["default"].config({
  path: './config/config.env'
}); // DB


(0, _db.connectDB)(); // Routes

// constants and variables
var PORT = process.env.PORT || 5000;
var app = (0, _express["default"])(); // Body parse middleware

app.use(_express["default"].json()); // Development logging middleware

if (process.env.NODE_ENV === 'development') {
  app.use((0, _morgan["default"])('dev'));
} // Mount routes


app.use('/api/v1/bootcamps', _bootcamps.bootcamps);
app.use(_error.errorHandler);
var server = app.listen(PORT, function () {
  console.log("Server running in ".concat(process.env.NODE_ENV, " on port ").concat(PORT));
});
process.on('unhandledRejection', function (err, promise) {
  console.log("Error ".concat(err.message));
  server.close(function () {
    return process.exit(1);
  });
});
