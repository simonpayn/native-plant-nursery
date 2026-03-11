import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const navigate = useNavigate();

  const contactComplete = customerName.trim() && customerEmail.trim() && customerPhone.trim();

  async function handleSubmit() {
    if (items.length === 0 || !contactComplete) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_phone: customerPhone.trim(),
          items: items.map((item) => ({
            plant_id: item.plant.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit order');
      const order = await res.json();
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      alert('Error submitting order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty. Browse our <a href="/">plant catalog</a> to get started.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.plant.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.plant.common_name}</h3>
              <p className="cart-item-detail">
                {item.plant.plant_name} &middot; {item.plant.container_size}
              </p>
              <p className="cart-item-price">${item.plant.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-control">
                <button
                  onClick={() => updateQuantity(item.plant.id, item.quantity - 1)}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.plant.id, item.quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              <p className="cart-item-line-total">
                ${(item.plant.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.plant.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="contact-form">
        <h2>Contact Information</h2>
        <label className="contact-label">
          Name
          <input
            type="text"
            className="contact-input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </label>
        <label className="contact-label">
          Email
          <input
            type="email"
            className="contact-input"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="contact-label">
          Phone
          <input
            type="tel"
            className="contact-input"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </label>
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !contactComplete}
          className="submit-btn"
        >
          {submitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </div>
    </div>
  );
}
