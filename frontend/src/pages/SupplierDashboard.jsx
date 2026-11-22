import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: ''
  });

  const navigate = useNavigate();

  // Fetch Supplier Products
  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/supplier/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Add New Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/supplier/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Product added successfully!");
      setProducts([res.data, ...products]);
      setShowAddForm(false);
      
      // Reset form
      setNewProduct({
        name: '', price: '', stock: '', category: '', description: '', image: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/supplier/login');
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Supplier Header */}
      <div className="bg-white shadow border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow">
              📦
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Supplier Portal</h1>
              <p className="text-green-600 text-sm">FreshMart Business Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-medium transition-all"
            >
              + Add New Product
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-2xl font-medium transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <p className="text-4xl font-bold mt-2">₹0</p>
            <p className="text-xs text-gray-500">This month</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-500 text-sm">Approval Status</p>
            <p className="text-xl font-semibold text-green-600 mt-2">Approved ✓</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b mb-10 bg-white rounded-t-3xl">
          {['products', 'orders', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-5 text-lg font-semibold border-b-4 transition-all ${
                activeTab === tab 
                  ? 'border-green-600 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold">My Products ({products.length})</h2>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xl">Loading your products...</div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center shadow">
                <p className="text-2xl text-gray-500 mb-6">You haven't added any products yet</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 font-medium"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-lg transition-all">
                    <img 
                      src={product.image || 'https://via.placeholder.com/400x250?text=No+Image'} 
                      alt={product.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-green-600 font-bold text-2xl">₹{product.price}</p>
                      <p className="text-gray-600 text-sm mt-3 line-clamp-3">{product.description}</p>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <span className={`px-4 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Stock: {product.stock}
                        </span>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Other Tabs (Coming Soon) */}
        {(activeTab === 'orders' || activeTab === 'profile') && (
          <div className="bg-white rounded-3xl p-20 text-center shadow">
            <p className="text-2xl text-gray-500">
              {activeTab === 'orders' ? 'Orders Management' : 'Supplier Profile'} - Coming Soon
            </p>
          </div>
        )}
      </div>

      {/* Add Product Modal - Fixed & Improved */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <input
                type="text"
                placeholder="Product Name *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price (₹) *"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Quantity *"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Category *"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500"
                required
              />

              <textarea
                placeholder="Product Description *"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 h-32 focus:outline-none focus:border-green-500"
                required
              />

              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500"
              />

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-4 border border-gray-300 rounded-2xl hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;