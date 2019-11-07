"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bootcamps = require("./routes/bootcamps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Routes
// Load env vars
_dotenv["default"].config({
  path: './config/config.env'
}); // constants and variables


var PORT = process.env.PORT || 5000;
var app = (0, _express["default"])(); // Mount routes

app.use('/api/v1/bootcamps', _bootcamps.bootcamps);
app.listen(PORT, function () {
  console.log("Server running in ".concat(process.env.NODE_ENV, " on port ").concat(PORT));
});
