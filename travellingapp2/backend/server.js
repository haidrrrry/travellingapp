const express = require('express');
const cors = require('cors');
require('dotenv').config();

const databaseConnection = require('./config/database');

// Import routes
const userRoutes = require('./routes/users');
const destinationRoutes = require('./routes/destinations');
const tripRoutes = require('./routes/trips');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production and development
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://*.netlify.app', // Netlify preview and production
    process.env.FRONTEND_URL // Custom frontend URL if set
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Added size limit for safety
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (for development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    const dbStatus = databaseConnection.getConnectionStatus();
    res.status(200).json({
      success: true,
      message: 'Traveling App API is running',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus.isConnected,
        host: dbStatus.host,
        name: dbStatus.name
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable - Database connection issue',
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Traveling App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      destinations: '/api/destinations',
      trips: '/api/trips',
      health: '/health'
    },
    documentation: 'Contact admin for API documentation'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err.stack);
  
  // Handle specific MongoDB errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry - resource already exists'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/auth',
      '/api/users', 
      '/api/destinations',
      '/api/trips',
      '/health'
    ]
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Starting Traveling App API...');
    
    // Connect to database
    await databaseConnection.connect();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 API available at http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  try {
    await databaseConnection.disconnect();
    console.log('✅ Server shut down complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

startServer();