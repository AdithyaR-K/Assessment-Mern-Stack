import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TaskList from '../pages/TaskList';
import CompletedTasks from '../pages/CompletedTask';
import './App.css'; 

// Simple header/navigation component
const Header = () => (
    <nav style={headerStyles.nav}>
        <Link to="/" style={headerStyles.navLink}>All Tasks</Link>
        <Link to="/completed" style={headerStyles.navLink}>Completed Tasks</Link>
    </nav>
);

function App() {
  return (
    // 1. Use BrowserRouter to enable routing
    <BrowserRouter>
      <div className="App">
        {/* Optional: Navigation for easy switching */}
        <Header /> 
        
        {/* 2. Define the Routes */}
        <Routes>
          {/* Route for the main page (Task List) */}
          <Route path="/" element={<TaskList />} />
          
          {/* Route for the completed tasks page */}
          <Route path="/completed" element={<CompletedTasks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const headerStyles = {
    nav: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
        marginBottom: '20px',
        maxWidth: '800px',
        margin: '0 auto 20px auto',
    },
    navLink: {
        textDecoration: 'none',
        color: '#333',
        padding: '10px 15px',
        margin: '0 5px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    }
};

export default App;