import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSuppliers: 0,
    totalRevenue: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const [productsRes, ordersRes, suppliersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/suppliers', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setSuppliers(suppliersRes.data);

      // Calculate Stats
      const revenue = ordersRes.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalSuppliers: suppliersRes.data.length,
        totalRevenue: revenue
      });

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const updateSupplierStatus = async (supplierId, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/suppliers/${supplierId}/status`,
        { isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(isApproved ? 'Supplier Approved' : 'Supplier Rejected');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b py-6 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow">
            🥬
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-green-600 font-medium">FreshMart • Full Control</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-medium transition-all"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-4xl font-bold text-green-600 mt-3">₹{stats.totalRevenue}</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-4xl font-bold mt-3">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-4xl font-bold mt-3">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow">
            <p className="text-gray-500 text-sm">Total Suppliers</p>
            <p className="text-4xl font-bold mt-3">{stats.totalSuppliers}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-10 bg-white rounded-t-3xl">
          {['overview', 'products', 'orders', 'suppliers'].map((tab) => (
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

        {loading ? (
          <div className="text-center py-20 text-xl text-gray-500">Loading dashboard data...</div>
        ) : activeTab === 'suppliers' ? (
          // Suppliers Tab
          <div className="bg-white rounded-3xl overflow-hidden shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-6">Company Name</th>
                  <th className="text-left p-6">Supplier Name</th>
                  <th className="text-left p-6">Email</th>
                  <th className="text-left p-6">Phone</th>
                  <th className="text-left p-6">Status</th>
                  <th className="text-right p-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr><td colSpan="6" className="p-20 text-center text-gray-500">No suppliers yet</td></tr>
                ) : (
                  suppliers.map((s) => (
                    <tr key={s._id} className="border-t hover:bg-gray-50">
                      <td className="p-6 font-semibold">{s.companyName}</td>
                      <td className="p-6">{s.name}</td>
                      <td className="p-6">{s.email}</td>
                      <td className="p-6">{s.phone || '-'}</td>
                      <td className="p-6">
                        <span className={`px-5 py-2 rounded-full text-sm font-medium ${s.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {s.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        {!s.isApproved ? (
                          <button onClick={() => updateSupplierStatus(s._id, true)} className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 text-sm">
                            Approve
                          </button>
                        ) : (
                          <button onClick={() => updateSupplierStatus(s._id, false)} className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 text-sm">
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-xl text-gray-500">
            {activeTab === 'products' && 'All Products Management - Coming Soon'}
            {activeTab === 'orders' && 'All Orders Management - Coming Soon'}
            {activeTab === 'overview' && 'Overview Dashboard - Coming Soon'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;