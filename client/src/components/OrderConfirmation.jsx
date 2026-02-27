import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="loading">Loading order...</div>;
  if (!order) return <div className="error">Order not found.</div>;

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <span className="confirmation-icon">&#10003;</span>
        <h1>Order Confirmed!</h1>
        <p className="order-number">Order #{order.id}</p>
      </div>
      <div className="confirmation-details">
        <h2>Contact Details</h2>
        <p><strong>Name:</strong> {order.customer_name}</p>
        <p><strong>Email:</strong> {order.customer_email}</p>
        <p><strong>Phone:</strong> {order.customer_phone}</p>
      </div>
      <div className="confirmation-details">
        <h2>Order Summary</h2>
        <div className="confirmation-items">
          {order.items.map((item) => (
            <div key={item.id} className="confirmation-item">
              <div>
                <strong>{item.common_name}</strong>
                <span className="item-meta">
                  {' '}&middot; {item.container_size} &middot; Qty: {item.quantity}
                </span>
              </div>
              <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="confirmation-total">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <p className="confirmation-status">
          Status: <strong>{order.status}</strong>
        </p>
      </div>
      <div className="confirmation-actions">
        <Link to="/" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
}
