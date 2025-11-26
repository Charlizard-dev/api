const socketIo = require('socket.io');

// Get allowed origins from environment or use defaults
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

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"], // Add polling fallback for cPanel
  });

  return io;
};

module.exports = { initializeSocket };