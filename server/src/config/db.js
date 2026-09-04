const mongoose = require('mongoose');

/**
 * Connect to MongoDB database with fallback and event logging
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/power_water_alerts';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn(`[MongoDB] Running in offline/disconnected mode until DB is reachable.`);
  }
};

module.exports = connectDB;
