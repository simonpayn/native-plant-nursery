import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminPlants from './AdminPlants';
import AdminOrders from './AdminOrders';
import AdminTemplates from './AdminTemplates';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [tab, setTab] = useState('plants');

  function handleLogin(newToken) {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    setToken('');
  }

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="remove-btn" onClick={handleLogout}>Log out</button>
      </div>
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'plants' ? 'active' : ''}`} onClick={() => setTab('plants')}>
          Plants
        </button>
        <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          Orders
        </button>
        <button className={`admin-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>
          Email Templates
        </button>
      </div>
      {tab === 'plants' && <AdminPlants token={token} onLogout={handleLogout} />}
      {tab === 'orders' && <AdminOrders token={token} onLogout={handleLogout} />}
      {tab === 'templates' && <AdminTemplates token={token} onLogout={handleLogout} />}
    </div>
  );
}
