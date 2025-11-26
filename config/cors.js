const cors = require('cors');

// Get allowed origins from environment variable or use defaults
const getAllowedOrigins = () => {
  const origins = [];
  
  // Add production frontend URL from environment
  if (process.env.PRODUCTION_FRONTEND_URL) {
    origins.push(process.env.PRODUCTION_FRONTEND_URL);
  }
  
  // Always allow citymovers.com.ph/adm (both http and https)
  origins.push(
    'http://citymovers.com.ph/adm',
    'https://citymovers.com.ph/adm',
    'http://www.citymovers.com.ph/adm',
    'https://www.citymovers.com.ph/adm'
  );
  
  // Add localhost for development
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173', 'http://localhost:3000');
  }
  
  // Remove duplicates
  return [...new Set(origins)];
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);