import { useState, useEffect } from 'react';

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  async function viewOrder(orderId) {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    setSelectedOrder(data);
  }

  async function updateStatus(orderId, newStatus) {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-dashboard">
      <h1>Orders Dashboard</h1>
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
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
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
              <h2>Order #{selectedOrder.id}</h2>
              <p>
                Placed: {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
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
                      <span className="item-meta">
                        {' '}({item.plant_name}) &middot; {item.container_size}
                      </span>
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
