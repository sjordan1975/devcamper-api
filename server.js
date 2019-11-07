import express from 'express';
import dotenv from 'dotenv';

// Routes
import { bootcamps } from './routes/bootcamps';

// Load env vars
dotenv.config({ path: './config/config.env' });

// constants and variables
const PORT = process.env.PORT || 5000;

const app = express();

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
