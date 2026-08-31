require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmark_manager';

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend (static files)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/bookmarks', bookmarkRoutes);

// Fallback to index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Connect to MongoDB, then start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
