import express from 'express';
import path from 'path';
import _ from './config/env'; // Load env vars
import morgan from 'morgan';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error';
import { connectDB } from './config/db';

// DB
connectDB();

// Routes
import { bootcamps, courses, auth, users } from './routes/';

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

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});
