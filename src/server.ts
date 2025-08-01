import express from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './config/db.config';
import { ApiError, globalErrorHandler } from './middlewares/error.middleware';

// Load environment variables from .env file
dotenv.config();

// PORT initialization
const PORT = process.env.PORT || 5000;

// APP initialization
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse all API related errors
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server started at PORT:${PORT}`);
});
