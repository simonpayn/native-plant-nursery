import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="submit-btn"
        >
          {submitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </div>
    </div>
  );
}
