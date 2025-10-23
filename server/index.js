const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware configuration
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(express.json()); // Parse JSON bodies

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Placeholder for future route mounting
// TODO: Mount job routes when implemented
// app.use('/api/jobs', require('./routes/jobRoutes'));

// TODO: Mount application routes when implemented
// app.use('/api/applications', require('./routes/applicationRoutes'));

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Export app for testing
module.exports = app;
