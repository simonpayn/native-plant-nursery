import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function PlantCard({ plant }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  function handleAdd() {
    addToCart(plant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    setQuantity(1);
  }

  const availDate = new Date(plant.availability_date + 'T00:00:00');
  const isAvailable = availDate <= new Date();

  return (
    <div className="plant-card">
      {plant.image_url && (
        <img src={plant.image_url} alt={plant.common_name} className="plant-card-image" />
      )}
      <div className="plant-card-body">
        <h3 className="plant-common-name">{plant.common_name}</h3>
        <p className="plant-scientific-name">{plant.plant_name}</p>
        {plant.description && (
          <p className="plant-description">{plant.description}</p>
        )}
        <div className="plant-details">
          <span className="plant-container">{plant.container_size}</span>
          <span className={`plant-availability ${isAvailable ? 'available' : 'upcoming'}`}>
            {isAvailable ? 'Available now' : `Available ${availDate.toLocaleDateString()}`}
          </span>
        </div>
        <div className="plant-tags">
          {plant.type && <span className="plant-tag plant-tag-type">{plant.type}</span>}
          {plant.sun_requirements && <span className="plant-tag plant-tag-sun">{plant.sun_requirements}</span>}
          {plant.moisture_requirements && <span className="plant-tag plant-tag-moisture">{plant.moisture_requirements}</span>}
        </div>
        <p className="plant-price">${plant.price.toFixed(2)}</p>
      </div>
      <div className="plant-card-actions">
        <div className="quantity-control">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="qty-btn"
          >
            -
          </button>
          <span className="qty-value">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="qty-btn"
          >
            +
          </button>
        </div>
        <button onClick={handleAdd} className={`add-btn ${added ? 'added' : ''}`}>
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
