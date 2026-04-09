import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Edit, Trash2, MapPin, Package, User, Calendar, LogOut, Plus } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    }
  };

  // Fetch Addresses (with your default Panipat address)
  const fetchAddresses = () => {
    setAddresses([{
      id: 1,
      fullAddress: "house number 2, binjhol",
      city: "panipat",
      state: "HARYANA",
      postalCode: "132103",
      country: "India",
      isDefault: true
    }]);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchOrders(), fetchAddresses()])
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Address Functions
  const handleSaveAddress = () => {
    if (!addressForm.fullAddress || !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...addressForm } : addr
      ));
      toast.success("Address updated successfully");
    } else {
      const newAddress = {
        id: Date.now(),
        ...addressForm,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
      toast.success("New address added successfully");
    }

    resetAddressForm();
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      fullAddress: addr.fullAddress,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      toast.success("Address deleted successfully");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  if (!user) {
    return <div className="text-center py-20 text-xl">Please login to view your profile</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-80 bg-white rounded-3xl p-8 h-fit lg:sticky lg:top-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-5xl">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-3 font-medium transition-all ${activeTab === 'profile' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-100'}`}
              >
                <User className="w-5 h-5" />
                Profile Information
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-3 font-medium transition-all ${activeTab === 'orders' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-100'}`}
              >
                <Package className="w-5 h-5" />
                Order History
              </button>

              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-3 font-medium transition-all ${activeTab === 'addresses' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-100'}`}
              >
                <MapPin className="w-5 h-5" />
                Saved Addresses
              </button>
            </div>

            <button 
              onClick={logout}
              className="mt-12 w-full py-4 border border-red-300 text-red-600 rounded-2xl hover:bg-red-50 transition-colors font-medium"
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-8 sm:p-10">
                <h2 className="text-4xl font-bold mb-8">Profile Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Full Name</p>
                    <p className="text-2xl font-semibold">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Email Address</p>
                    <p className="text-xl break-all">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Phone Number</p>
                      <p className="text-xl">{user.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Account Type</p>
                    <p className="inline-block px-6 py-2 bg-green-100 text-green-700 rounded-full font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-8 sm:p-10">
                <h2 className="text-4xl font-bold mb-8">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                    <p className="text-2xl text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-3xl p-8 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="font-mono text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                            <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <span className={`px-6 py-2 rounded-full text-sm font-medium ${
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="text-3xl font-bold text-green-600 mb-6">
                          ₹{order.total.toFixed(2)}
                        </div>

                        <div className="text-sm text-gray-600">
                          {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab - Fully Functional */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-8 sm:p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-4xl font-bold">Saved Addresses</h2>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-green-700 transition-all"
                  >
                    <Plus className="w-5 h-5" /> Add New Address
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 mb-10">
                    <h3 className="text-xl font-semibold mb-6">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2">Full Address *</label>
                        <input
                          type="text"
                          value={addressForm.fullAddress}
                          onChange={(e) => setAddressForm({...addressForm, fullAddress: e.target.value})}
                          className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                          placeholder="House number 2, binjhol"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                          placeholder="Panipat"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State *</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                          className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                          placeholder="HARYANA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Postal Code *</label>
                        <input
                          type="text"
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                          className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500"
                          placeholder="132103"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button 
                        onClick={handleSaveAddress}
                        className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700"
                      >
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                      <button 
                        onClick={resetAddressForm}
                        className="flex-1 border border-gray-300 py-4 rounded-2xl font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Addresses List */}
                {addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-200 rounded-3xl p-8 mb-6">
                      <div className="flex justify-between">
                        <div className="flex items-start gap-4">
                          <MapPin className="w-6 h-6 text-green-600 mt-1" />
                          <div>
                            <p className="font-semibold text-lg">{addr.fullAddress}</p>
                            <p className="text-gray-600 mt-1">
                              {addr.city}, {addr.state} {addr.postalCode}
                            </p>
                            <p className="text-gray-600">{addr.country}</p>
                          </div>
                        </div>
                        {addr.isDefault && (
                          <span className="px-5 py-1 bg-green-100 text-green-700 text-sm rounded-full self-start">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={() => handleEditAddress(addr)}
                          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <Edit className="w-5 h-5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-12">No addresses saved yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;