const Task = require('../models/Task');

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask); // 200 OK
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

module.exports = updateTask;