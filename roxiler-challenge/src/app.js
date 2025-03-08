const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with increased timeout
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roxiler', {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', transactionRoutes);

module.exports = app;
