'use strict';

var _express = _interopRequireDefault(require('express'));

var _dotenv = _interopRequireDefault(require('dotenv'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Load env vars
_dotenv['default'].config({
  path: './config/config.env'
});

var app = (0, _express['default'])();
var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(
    'Server running in '.concat(process.env.NODE_ENV, ' on port ').concat(PORT)
  );
});
