import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { connectDB } from './config/db';

// Load env vars
dotenv.config({ path: './config/config.env' });

// DB
connectDB();

// Routes
import { bootcamps } from './routes/bootcamps';

// constants and variables
const PORT = process.env.PORT || 5000;

const app = express();

// Body parse middleware
app.use(express.json());

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});
