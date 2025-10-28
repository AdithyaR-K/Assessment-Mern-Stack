const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
  try {
    // Fetches all tasks, newest first
    const tasks = await Task.find().sort({ createdAt: -1 }); 
    res.status(200).json(tasks); // 200 OK
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

module.exports = getAllTasks;