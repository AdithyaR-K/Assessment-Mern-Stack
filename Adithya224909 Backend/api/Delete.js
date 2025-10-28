const Task = require('../models/Task');

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = deleteTask;