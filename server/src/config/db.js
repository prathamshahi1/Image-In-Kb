import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imageforge';

  // Disable Mongoose command buffering so queries don't hang when DB is offline
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500
    });

    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB offline or unreachable (${error.message}).`);
    console.log('💡 Activated ultra-fast in-memory store for offline development.');
  }
};

export const isDBReady = () => {
  return isConnected && mongoose.connection.readyState === 1;
};
