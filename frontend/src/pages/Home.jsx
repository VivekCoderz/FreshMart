import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, Leaf } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?sort=newest');
        setFeaturedProducts(res.data.slice(0, 8));
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Vegetables', icon: Leaf, color: 'bg-green-100 text-green-700' },
    { name: 'Fruits', icon: ShoppingCart, color: 'bg-orange-100 text-orange-700' },
    { name: 'Dairy', icon: Truck, color: 'bg-blue-100 text-blue-700' },
    { name: 'Pantry', icon: Shield, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Meat', icon: ShoppingCart, color: 'bg-red-100 text-red-700' },
    { name: 'Bakery', icon: Leaf, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Grocery Image */}
      <div 
        className="relative h-[580px] sm:h-[650px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a9c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')`
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Fresh Groceries<br />
              <span className="text-primary-500">Delivered to Your Door</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Shop organic produce, quality meats, and pantry essentials from local farms. 
              Same-day delivery available.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-3 transition-all"
              >
                Shop Now 
                <ShoppingCart className="w-6 h-6" />
              </Link>
              
              <Link 
                to="/categories"
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-full text-lg font-semibold transition-all"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>

        {/* FreshMart Logo */}
        <div className="absolute top-8 left-6 sm:left-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            🥬
          </div>
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">FreshMart</h2>
            <p className="text-white/70 text-sm">Fresh • Organic • Fast</p>
          </div>
        </div>
      </div>

      {/* Why Choose FreshMart */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why choose FreshMart</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing you the freshest groceries with unmatched convenience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Fresh & Organic</h3>
              <p className="text-gray-600 leading-relaxed">
                Sourced directly from local farms, ensuring peak freshness and quality in every product.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
                <Truck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Same-day delivery available. Get your groceries delivered within 2 hours of ordering.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">
                Not satisfied? We offer a full refund on any product that doesn't meet your expectations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-3">Shop by category</h2>
            <p className="text-xl text-gray-600">Browse our wide selection of fresh products</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <Link 
                key={index}
                to={`/products?category=${cat.name}`}
                className="group bg-white rounded-3xl p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${cat.color}`}>
                  <cat.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold">Fresh Arrivals</h2>
              <p className="text-gray-600 mt-2">Handpicked just for you</p>
            </div>
            <Link 
              to="/products" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              View All Products →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Banner - Fixed & Clearly Visible */}
<div className="bg-green-600 py-16 sm:py-24 text-white relative overflow-hidden">
  {/* Optional subtle pattern/background */}
  <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[length:20px_20px]"></div>
  
  <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
    <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
      Start shopping today
    </h2>
    <p className="text-xl sm:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
      Join thousands of satisfied customers who trust FreshMart for their grocery needs
    </p>
    
    <Link 
      to="/register"
      className="inline-block bg-white text-green-600 hover:bg-gray-100 px-12 py-5 rounded-full text-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
    >
      Create Free Account →
    </Link>
  </div>
</div>
    </div>
  );
};

export default Home;