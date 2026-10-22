import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus_marketplace';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Running in disconnected mode. Please make sure MongoDB is running locally or provide MONGODB_URI in .env');
    // Don't crash immediately so health checks and mock fallbacks can respond
    return null;
  }
}

export default connectDB;
