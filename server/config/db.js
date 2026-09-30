const mongoose = require('mongoose');

let isMongooseConnected = false;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://dating:OdtSvEp9hv7I8GTB@cluster1.mafyefw.mongodb.net/koimilgaya?retryWrites=true&w=majority';

  if (cached.conn && mongoose.connection.readyState === 1) {
    isMongooseConnected = true;
    return true;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose.connect(uri, opts).then((m) => {
      isMongooseConnected = true;
      console.log(`MongoDB Connected: ${m.connection.host}`);
      return m;
    }).catch((err) => {
      console.error('MongoDB Atlas Connection Error:', err.message);
      isMongooseConnected = false;
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    isMongooseConnected = !!(cached.conn && mongoose.connection.readyState === 1);
    return isMongooseConnected;
  } catch (error) {
    console.error('Database connection execution error:', error.message);
    isMongooseConnected = false;
    return false;
  }
};

module.exports = {
  connectDB,
  get isMongooseConnected() { return isMongooseConnected; }
};

