const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

// CORS configuration - allow frontend origin with credentials
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('Database connected successfully!');
  } catch (error) {
    console.warn('Warning: Could not connect to database:', error.message);
    console.warn('Server will start, but database features may not work.');
  }
  
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST /register - User registration');
    console.log('  POST /login    - User login');
    console.log('  POST /logout   - User logout');
    console.log('  GET  /verify   - Verify authentication');
    console.log('  GET  /health   - Health check');
  });
};

startServer();
