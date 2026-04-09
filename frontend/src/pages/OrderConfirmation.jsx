import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Package } from 'lucide-react';
import api from '../services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-xl">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Order not found</h2>
          <Link to="/" className="text-green-600 mt-4 inline-block">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="mb-10">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-2xl text-gray-600 mb-12">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>

        <div className="bg-white rounded-3xl p-10 shadow-sm mb-12">
          <div className="grid grid-cols-2 gap-8 text-left">
            <div>
              <p className="text-gray-500 text-sm">Order Number</p>
              <p className="font-mono font-medium">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Order Date</p>
              <p>{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Delivery Address
              </p>
              <p className="font-medium">
                {order.deliveryAddress.fullAddress}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Estimated Delivery
              </p>
              <p className="font-medium">April 10, 2026</p>
            </div>
          </div>

          <div className="border-t my-10" />

          <div>
            <h3 className="font-semibold text-xl mb-6">Order Items</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between py-4 border-b last:border-none">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-10 pt-8 border-t text-xl">
            <span className="font-semibold">Total Paid</span>
            <span className="font-bold text-green-600">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="bg-green-600 text-white px-10 py-4 rounded-3xl font-semibold hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
          
          <Link 
            to="/dashboard"
            className="border border-gray-300 px-10 py-4 rounded-3xl font-semibold hover:bg-gray-50 transition-colors"
          >
            View My Orders
          </Link>
        </div>

        <p className="mt-12 text-gray-500">
          Order Status: <span className="font-medium text-orange-600">Pending</span>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;