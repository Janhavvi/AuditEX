import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. API will start, but database routes will fail until configured.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    console.warn('API will start without database connection');
  }
};
