import { Routes, Route, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import PlantCatalog from './components/PlantCatalog';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import OrdersDashboard from './components/OrdersDashboard';

export default function App() {
  const { itemCount } = useCart();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">&#127793;</span>
            Native Plant Nursery
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Catalog</Link>
            <Link to="/orders" className="nav-link">Orders</Link>
            <Link to="/cart" className="nav-link cart-link">
              Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<PlantCatalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders" element={<OrdersDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
