const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task); // 201 Created
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

module.exports = createTask;
