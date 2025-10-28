import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the base URL for your backend API
// This must match the port your Node.js server is running on (default: 5000)
const API_URL = 'http://localhost:5000/api/tasks';

function TaskList() {
    // State to hold the list of tasks fetched from the backend
    const [tasks, setTasks] = useState([]);
    
    // State for the new task form inputs
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    
    // State to manage which task is currently being edited
    const [editingTask, setEditingTask] = useState(null); 
    
    // State for the edit form inputs
    const [editForm, setEditForm] = useState({ title: '', description: '', status: '' });
    
    // --- API: GET /api/tasks (Fetch All Tasks) ---
    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            // Sort tasks: Completed items go to the end, others are newest first
            const sortedTasks = response.data.sort((a, b) => {
                if (a.status === 'Completed' && b.status !== 'Completed') return 1;
                if (a.status !== 'Completed' && b.status === 'Completed') return -1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Load tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // --- API: POST /api/tasks (Add Task) ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        try {
            await axios.post(API_URL, newTask);
            setNewTask({ title: '', description: '' });
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // --- API: PUT /api/tasks/:id (Toggle Status) ---
    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            await axios.put(`${API_URL}/${task._id}`, { status: newStatus });
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    
    // --- API: DELETE /api/tasks/:id (Delete Task) ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await axios.delete(`${API_URL}/${id}`);
            // Update the state instantly
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // --- Edit Mode Handlers ---
    const startEdit = (task) => {
        // Populate the edit form with the task's current data
        setEditingTask(task._id);
        setEditForm({ 
            title: task.title, 
            description: task.description || '', 
            status: task.status 
        });
    };

    // --- API: PUT /api/tasks/:id (Save Edits) ---
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/${editingTask}`, editForm);
            setEditingTask(null); // Exit edit mode
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h1>Adithya 224909 Task_Manager</h1>
            
            {/* --- Form to Add New Tasks --- */}
            <div style={styles.formSection}>
                <h2>Add New Task</h2>
                <form onSubmit={handleAddSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Task Title (Required)"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Description (Optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        style={styles.textarea}
                    />
                    <button type="submit" style={styles.addButton}>Add Task</button>
                </form>
            </div>
            
            {/* --- List of Tasks --- */}
            <div style={styles.listSection}>
                <h2>Task List</h2>
                <ul style={styles.taskList}>
                    {tasks.length === 0 ? (
                        <p>No tasks yet! Add one above. 🚀</p>
                    ) : (
                        tasks.map((task) => (
                            <li key={task._id} style={task._id === editingTask ? styles.editingItem : styles.taskItem}>
                                {task._id === editingTask ? (
                                    // --- Edit Form (visible when editing) ---
                                    <form onSubmit={handleEditSubmit} style={styles.editForm}>
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            style={styles.editInput}
                                            required
                                        />
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            style={styles.editTextarea}
                                        />
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            style={styles.editInput}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <div style={styles.buttonGroup}>
                                            <button type="submit" style={styles.saveButton}>Save</button>
                                            <button type="button" onClick={() => setEditingTask(null)} style={styles.cancelButton}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    // --- Display Mode ---
                                    <>
                                        <div style={{...styles.taskDetails, textDecoration: task.status === 'Completed' ? 'line-through' : 'none'}}>
                                            <strong style={styles.taskTitle}>{task.title}</strong>
                                            {task.description && <p style={styles.taskDescription}>{task.description}</p>}
                                            <small style={styles.taskStatus}>Status: {task.status}</small>
                                        </div>

                                        <div style={styles.buttonGroup}>
                                            {/* Status Toggle Button */}
                                            <button 
                                                onClick={() => toggleStatus(task)} 
                                                style={task.status === 'Completed' ? styles.pendingButton : styles.completeButton}
                                            >
                                                {task.status === 'Completed' ? 'Pending' : 'Complete'}
                                            </button>
                                            
                                            {/* Edit Button */}
                                            <button onClick={() => startEdit(task)} style={styles.editButton}>Edit</button>
                                            
                                            {/* Delete Button */}
                                            <button onClick={() => handleDelete(task._id)} style={styles.deleteButton}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

// Basic Inline Styles for simplicity
const styles = {
    container: { maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    formSection: { padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#f0f0f0' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
    textarea: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' },
    addButton: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    
    listSection: { borderTop: '2px solid #eee', paddingTop: '20px' },
    taskList: { listStyle: 'none', padding: 0 },
    taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#fff', margin: '10px 0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    editingItem: { padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#fffbe6', margin: '10px 0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    
    taskDetails: { flexGrow: 1, marginRight: '20px' },
    taskTitle: { fontSize: '1.2em', display: 'block', fontWeight: 'bold' },
    taskDescription: { margin: '5px 0 0', color: '#555', fontSize: '0.9em' },
    taskStatus: { fontSize: '0.8em', color: '#888' },
    
    buttonGroup: { display: 'flex', gap: '8px' },
    completeButton: { padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' },
    pendingButton: { padding: '8px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' },
    editButton: { padding: '8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    deleteButton: { padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    
    editForm: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' },
    editInput: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
    editTextarea: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' },
    saveButton: { padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    cancelButton: { padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default TaskList;