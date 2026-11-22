import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import AdminDashboard from './pages/AdminDashboard';

// Supplier Pages
import SupplierRegister from './pages/SupplierRegister';
import SupplierLogin from './pages/SupplierLogin';
import SupplierDashboard from './pages/SupplierDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        
        {/* Global Navbar - Sirf non-supplier aur non-admin pages ke liye */}
        <Routes>
          <Route path="/supplier/dashboard" element={null} />
          <Route path="/admin/dashboard" element={null} />
          <Route path="/*" element={<Navbar />} />
        </Routes>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/categories" element={<Categories />} />

            {/* Supplier Routes */}
            <Route path="/supplier/register" element={<SupplierRegister />} />
            <Route path="/supplier/login" element={<SupplierLogin />} />
            
            <Route 
              path="/supplier/dashboard" 
              element={
                <ProtectedRoute supplierOnly={true}>
                  <SupplierDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Admin Route */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer - Hide on supplier & admin dashboard */}
        <Routes>
          <Route path="/supplier/dashboard" element={null} />
          <Route path="/admin/dashboard" element={null} />
          <Route path="/*" element={<Footer />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;