import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/tasks';

function CompletedTasks() {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompletedTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            // 1. Filter the tasks to only include those where status is "Completed"
            const filteredTasks = response.data.filter(task => task.status === 'Completed');
            
            // 2. Sort them (e.g., newest completed task first)
            const sortedTasks = filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setCompletedTasks(sortedTasks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    if (loading) {
        return <div style={styles.container}>Loading completed tasks...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={{color: '#28a745'}}>✅ Completed Tasks</h1>
            <nav>
                {/* Link back to the main list */}
                <Link to="/" style={styles.navLink}>← Back to All Tasks</Link>
            </nav>
            
            <div style={styles.listSection}>
                <ul style={styles.taskList}>
                    {completedTasks.length === 0 ? (
                        <p style={{marginTop: '20px', color: '#555'}}>No tasks have been completed yet!</p>
                    ) : (
                        completedTasks.map((task) => (
                            <li key={task._id} style={styles.taskItem}>
                                <div style={styles.taskDetails}>
                                    <strong style={styles.taskTitle}>{task.title}</strong>
                                    {task.description && <p style={styles.taskDescription}>{task.description}</p>}
                                    <small style={styles.taskStatus}>Completed on: {new Date(task.createdAt).toLocaleDateString()}</small>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

// Reusing some basic styles for consistency
const styles = {
    container: { maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    navLink: { display: 'inline-block', marginBottom: '20px', color: '#007bff', textDecoration: 'none' },
    listSection: { borderTop: '2px solid #eee', paddingTop: '20px' },
    taskList: { listStyle: 'none', padding: 0 },
    taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderLeft: '5px solid #28a745', backgroundColor: '#e9f7eb', margin: '10px 0', borderRadius: '4px', opacity: 0.8 },
    taskDetails: { flexGrow: 1, marginRight: '20px' },
    taskTitle: { fontSize: '1.2em', display: 'block', fontWeight: 'bold' },
    taskDescription: { margin: '5px 0 0', color: '#555', fontSize: '0.9em' },
    taskStatus: { fontSize: '0.8em', color: '#555' },
};

export default CompletedTasks;