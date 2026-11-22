import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SupplierRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/supplier/register', formData);
      
      toast.success("Registration successful! Waiting for admin approval.");
      navigate('/supplier/login');
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-600 py-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow">
            <span className="text-5xl">📦</span>
          </div>
          <h1 className="text-white text-3xl font-bold">Become a Supplier</h1>
          <p className="text-green-100 mt-1">Join FreshMart Supplier Network</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl text-lg transition-all disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register as Supplier"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/supplier/login" className="text-green-600 font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegister;