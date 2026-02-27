import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(plant, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.plant.id === plant.id);
      if (existing) {
        return prev.map((item) =>
          item.plant.id === plant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { plant, quantity }];
    });
  }

  function updateQuantity(plantId, quantity) {
    if (quantity <= 0) {
      return removeFromCart(plantId);
    }
    setItems((prev) =>
      prev.map((item) =>
        item.plant.id === plantId ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(plantId) {
    setItems((prev) => prev.filter((item) => item.plant.id !== plantId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, item) => sum + item.plant.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
