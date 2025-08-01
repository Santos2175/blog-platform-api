import mongoose from 'mongoose';

// Connects to MongoDB using mongoose and exits the process on failure
export async function connectToMongoDB() {
  try {
    // Check if MongoDB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error(
        `MONGODB_URI is missing. Please include it in your environment variables`
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`✅ Connected to MongoDB`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Connection to MongoDB failed: ${error.message}`);
    } else {
      console.error(`An unknown error occured while connecting to MongoDB`);
    }
    process.exit(1);
  }
}
