import { Routes, Route, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import PlantCatalog from './components/PlantCatalog';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import OrdersDashboard from './components/OrdersDashboard';
import Admin from './components/Admin';

export default function App() {
  const { itemCount } = useCart();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Haliburton Micromeadows logo" className="logo-img" />
            Haliburton Micromeadows
          </Link>
          <nav className="nav">
            <a href="https://haliburtonmicromeadows.ca/" className="nav-link">Home</a>
            <Link to="/" className="nav-link">Catalog</Link>
            <Link to="/orders" className="nav-link">Orders</Link>
            <Link to="/cart" className="nav-link cart-link">
              Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<PlantCatalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders" element={<OrdersDashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-brand">Haliburton Micromeadows</span>
          <span>Call or text: <a href="tel:7059334889">705-933-4889</a></span>
          <span>Email: <a href="mailto:haliburtonmm@gmail.com">haliburtonmm@gmail.com</a></span>
        </div>
      </footer>
    </div>
  );
}
