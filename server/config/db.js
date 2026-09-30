import mongoose from 'mongoose';

export let isMongooseConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/heartsync_dating';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isMongooseConnected = true;
    return true;
  } catch (error) {
    console.log(`Local MongoDB server not detected (${error.message}). Operating using in-memory dataset.`);
    isMongooseConnected = false;
    return false;
  }
};
