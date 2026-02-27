import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">AuthApp</div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ width: 'auto', padding: '10px 24px' }}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h1 className="welcome-title">Hello, Welcome!</h1>
          <p className="welcome-subtitle">You have successfully logged in to your account.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
