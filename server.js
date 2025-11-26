const express = require('express');
const http = require('http');
require('dotenv').config();

const corsMiddleware = require('./config/cors');
const { initializeSocket } = require('./config/socket');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 5000;

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(corsMiddleware);

// Import routes
const routes = require('./routes');

// Socket setup
const server = http.createServer(app);
const io = initializeSocket(server);

// Make io accessible
app.set('io', io);
 
// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'CityMovers API is running', 
    timestamp: new Date().toISOString(),
    apiBaseUrl: '/api',
    frontendUrl: process.env.PRODUCTION_FRONTEND_URL || 'http://citymovers.com.ph/adm'
  });
});

// API routes - all routes will be under /api
// Example: citymovers.com.ph/api/auth/login
app.use('/api', routes);
 
// DB Connection
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('❌ MySQL database configuration is missing!');
  console.error('   Required: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
  process.exit(1);
}

connectDB()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error('   Please either:');
        console.error(`   1. Stop the process using port ${PORT}`);
        console.error('   2. Change PORT in .env file to a different port');
        console.error('\n   To find what\'s using the port, run:');
        console.error(`   netstat -ano | findstr :${PORT}`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      }
    });
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
    console.error('   Please check:');
    console.error('   - Database credentials in .env file');
    console.error('   - Database exists in phpMyAdmin');
    console.error('   - User has proper privileges');
    console.error('   - Database schema is imported');
    process.exit(1);
  });
 