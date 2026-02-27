const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Allow any vercel.app domain or configured origins
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for now
  },
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
