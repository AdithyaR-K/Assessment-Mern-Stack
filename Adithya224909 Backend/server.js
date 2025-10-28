const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

// Import routes from the nested folder structure you specified
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables (reads MONGO_URI from the updated .env file)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // This now holds your Atlas URI

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

// API Routes: http://localhost:5000/api/tasks will use the imported router
app.use('/api/tasks', taskRoutes); 

// Connect to MongoDB Atlas
// Mongoose uses the connection string from MONGO_URI regardless of it being local or cloud
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully to task manager database. ☁️');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB Atlas connection error. Check your MONGO_URI and Atlas IP settings:', err);
    process.exit(1); 
  });   