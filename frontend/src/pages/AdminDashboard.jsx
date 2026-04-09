import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import AddProductModal from '../components/AddProductModal';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your grocery store</p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-8 py-4 rounded-3xl flex items-center gap-3 hover:bg-green-700 transition-all font-semibold"
          >
            <span>+</span> Add New Product
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-10">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-10 py-4 font-semibold text-lg border-b-4 transition-all ${activeTab === 'products' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
          >
            Products ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-10 py-4 font-semibold text-lg border-b-4 transition-all ${activeTab === 'orders' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl">Loading dashboard...</div>
        ) : activeTab === 'products' ? (
          <div className="bg-white rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-6">Product</th>
                  <th className="text-left p-6">Category</th>
                  <th className="text-left p-6">Price</th>
                  <th className="text-left p-6">Stock</th>
                  <th className="text-right p-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="p-6 flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-xl" />
                      <div className="font-semibold">{product.name}</div>
                    </td>
                    <td className="p-6">
                      <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-6 font-semibold">₹{product.price}</td>
                    <td className="p-6">
                      <span className={`${product.stock < 20 ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-600 hover:text-red-700 px-5 py-2 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Orders Table (same as before)
          <div className="bg-white rounded-3xl overflow-hidden">
            {/* ... existing orders table code from previous message ... */}
            {/* (I kept it short here - you can copy the orders table from previous response) */}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onProductAdded={handleProductAdded} 
      />
    </div>
  );
};

export default AdminDashboard;