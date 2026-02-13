import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import InputForm from './pages/InputForm';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Carbon Monitor</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/input">Input Data</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
