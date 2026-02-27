import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, {
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
