import express from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './config/db.config';
import { globalErrorHandler } from './middlewares/error.middleware';
import { undefinedRouteHandler } from './middlewares/route.middleware';
import apiRoutes from './routes/index';

// Load environment variables from .env file
dotenv.config();

// PORT initialization
const PORT = process.env.PORT || 5000;

// APP initialization
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api/v1', apiRoutes);

// Middleware to check undefined routes
app.use(undefinedRouteHandler);

// Middleware to parse all API related errors
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server started at PORT:${PORT}`);
});
