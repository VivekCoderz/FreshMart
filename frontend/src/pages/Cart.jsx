import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    total, 
    clearCart 
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-4xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
          <Link 
            to="/products"
            className="inline-block bg-green-600 text-white px-10 py-4 rounded-3xl font-semibold hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/products" className="text-gray-600 hover:text-green-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-5xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {cart.map((item) => (
                <div key={item.product} className="flex gap-6 p-8 border-b last:border-none">
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || 'https://via.placeholder.com/300'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-2xl mb-1">{item.name}</h3>
                        <p className="text-green-600 font-medium">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-2xl">
                        <button 
                          onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                          className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-l-2xl"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-8 font-semibold text-xl">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                          className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-r-2xl"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={clearCart}
              className="mt-6 text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-10 sticky top-24">
              <h2 className="text-3xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-6 flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full mt-10 bg-green-600 hover:bg-green-700 text-white py-5 rounded-3xl text-xl font-semibold transition-all flex items-center justify-center gap-3"
              >
                Proceed to Checkout →
              </button>

              <Link 
                to="/products"
                className="block text-center mt-6 text-gray-600 hover:text-green-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;