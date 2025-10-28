const express = require('express');
const router = express.Router();

// Import the handler functions from the /api folder
// Path: Go up one level (..) then down to 'api'
const createTask = require('../api/Post');
const getAllTasks = require('../api/Get');
const updateTask = require('../api/Put');
const deleteTask = require('../api/Delete');

// Define the endpoints and assign the imported functions
// (The logic is now cleaner and separated!)

// POST /api/tasks
router.post('/', createTask);

// GET /api/tasks
router.get('/', getAllTasks);

// PUT /api/tasks/:id
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;