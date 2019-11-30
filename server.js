import express from 'express';
import path from 'path';
import _ from './config/env'; // Load env vars
import morgan from 'morgan';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { errorHandler } from './middleware/error';
import { connectDB } from './config/db';

// DB
connectDB();

// Routes
import { bootcamps, courses, auth, users, reviews } from './routes/';

// constants and variables
const PORT = process.env.PORT || 5000;

const app = express();

// Body parse middleware
app.use(express.json());

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploader
app.use(fileupload());

// Cookie parser
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Sanitize data
app.use(mongoSanitize());

// Use Helmet for security headers
app.use(helmet());

// Use xss-clean for to combat cross site scripting
app.use(xss());

// Use rate-limit to limit rate of requests
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100
});

app.use(limiter);

// Use hpp to prevent param pollution
app.use(hpp());

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});
