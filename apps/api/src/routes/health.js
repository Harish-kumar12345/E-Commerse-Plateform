import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (mongoose.connection.readyState === 1) {
      dbStatus = 'ok (connected to MongoDB)';
    } else if (mongoose.connection.readyState === 2) {
      dbStatus = 'connecting';
    } else {
      dbStatus = 'offline/disconnected';
    }
  } catch (e) {
    dbStatus = `unreachable: ${e.message}`;
  }

  res.json({
    success: true,
    data: {
      service: 'NEXUS MERN REST API v1',
      stack: 'MongoDB + Express + React + Node.js (MERN)',
      status: 'online',
      database: dbStatus,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
