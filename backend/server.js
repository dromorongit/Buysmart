// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '../assets/images')));

// Serve static files from public directory
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Cookie parser middleware for JWT token handling
app.use(require('cookie-parser')());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Development error handler - will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
      message: err.message,
      error: err,
      stack: err.stack
    });
  });
}

// Database connection with validation
const mongodbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongodbUri) {
  console.error('MongoDB connection URI is not defined in environment variables');
  console.error('Please set MONGODB_URI or MONGO_URI environment variable');
  process.exit(1);
}

// Updated for Mongoose 6+ - removed deprecated options
mongoose.connect(mongodbUri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Connection string used:', mongodbUri);
  process.exit(1);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const viewRoutes = require('./routes/viewRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/', viewRoutes);
app.use('/', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});