const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required for a task'],
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed'], // Enforces valid status values
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
    timestamps: true 
});

module.exports = mongoose.model('Task', TaskSchema);