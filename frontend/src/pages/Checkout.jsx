import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, subtotal, tax, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullAddress: "house number 2, binjhol",
    city: "panipat",
    state: "HARYANA",
    postalCode: "132103",
    country: "India"
  });

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place order");
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        orderItems: cart.map(item => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        deliveryAddress,
        subtotal,
        tax,
        total
      };

      const res = await api.post('/orders', orderData);

      toast.success("Order placed successfully!");
      clearCart();

      // Redirect to order confirmation (you can create this page later)
      navigate(`/order-confirmation/${res.data.order._id}`);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-12">Checkout</h1>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Delivery Address */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl p-10">
              <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
                <span>📍</span> Delivery Address
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Address</label>
                  <input 
                    type="text" 
                    value={deliveryAddress.fullAddress}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, fullAddress: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.postalCode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, postalCode: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.country}
                      readOnly
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4 bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-3xl p-10 sticky top-8">
              <h2 className="text-3xl font-semibold mb-8">Order Summary</h2>

              <div className="space-y-6 mb-10">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p>{item.name} × {item.quantity}</p>
                    </div>
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-8 space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl border-t pt-6">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-6 rounded-3xl text-xl font-semibold transition-all"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Secure payment via Stripe (placeholder)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;