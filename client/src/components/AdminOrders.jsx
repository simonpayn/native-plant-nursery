import { useState, useEffect } from 'react';

export default function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => { fetchOrders(); }, []);

  function fetchOrders() {
    fetch('/api/admin/orders', { headers })
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  async function viewOrder(orderId) {
    const res = await fetch(`/api/admin/orders/${orderId}`, { headers });
    const data = await res.json();
    setSelectedOrder(data);
  }

  async function updateStatus(orderId, newStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <h2>Review Orders ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="no-results">No orders yet.</p>
      ) : (
        <div className="dashboard-layout">
          <div className="orders-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`order-row ${selectedOrder?.id === order.id ? 'active' : ''}`}
                onClick={() => viewOrder(order.id)}
              >
                <div className="order-row-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-row-meta">
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                  <span className="order-row-total">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          {selectedOrder && (
            <div className="order-detail">
              <h3>Order #{selectedOrder.id}</h3>
              <p>Placed: {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <div className="order-contact-info">
                <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
              </div>
              <div className="status-controls">
                <span>Status:</span>
                {['pending', 'processing', 'completed'].map((s) => (
                  <button
                    key={s}
                    className={`status-btn ${selectedOrder.status === s ? 'active' : ''}`}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="order-detail-items">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="detail-item">
                    <div>
                      <strong>{item.common_name}</strong>
                      <span className="item-meta"> ({item.plant_name}) &middot; {item.container_size}</span>
                    </div>
                    <div className="detail-item-nums">
                      <span>Qty: {item.quantity}</span>
                      <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-detail-total">
                <span>Total:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
