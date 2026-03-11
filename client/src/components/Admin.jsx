import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminPlants from './AdminPlants';
import AdminOrders from './AdminOrders';

export default function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [tab, setTab] = useState('plants');

  function handleLogin(newToken) {
    sessionStorage.setItem('adminToken', newToken);
    setToken(newToken);
  }

  function handleLogout() {
    sessionStorage.removeItem('adminToken');
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
      </div>
      {tab === 'plants' ? <AdminPlants token={token} onLogout={handleLogout} /> : <AdminOrders token={token} onLogout={handleLogout} />}
    </div>
  );
}
