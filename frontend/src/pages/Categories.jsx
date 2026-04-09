import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Leaf, Apple, Milk, Package, Beef, Cake 
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for each category
  const iconMap = {
    'Vegetables': Leaf,
    'Fruits': Apple,
    'Dairy': Milk,
    'Pantry': Package,
    'Meat': Beef,
    'Bakery': Cake,
  };

  const colorMap = {
    'Vegetables': 'bg-green-100 text-green-700',
    'Fruits': 'bg-orange-100 text-orange-700',
    'Dairy': 'bg-blue-100 text-blue-700',
    'Pantry': 'bg-amber-100 text-amber-700',
    'Meat': 'bg-red-100 text-red-700',
    'Bakery': 'bg-purple-100 text-purple-700',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products/categories');
        
        // Add 'All' category manually
        const allCategories = ['All', ...res.data];
        
        setCategories(allCategories);
      } catch (error) {
        toast.error('Failed to load categories');
        // Fallback categories if API fails
        setCategories(['All', 'Vegetables', 'Fruits', 'Dairy', 'Pantry', 'Meat', 'Bakery']);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of fresh, high-quality products from local farms
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category] || Package;
            const colorClass = colorMap[category] || 'bg-gray-100 text-gray-700';

            return (
              <Link
                key={category}
                to={category === 'All' ? '/products' : `/products?category=${category}`}
                className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-green-100"
              >
                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 ${colorClass}`}>
                  <Icon className="w-16 h-16" />
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{category}</h3>
                <p className="text-gray-500 text-sm">Explore fresh {category.toLowerCase()}</p>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-green-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-xl mb-8 max-w-lg mx-auto">
            Browse all our products or contact us for special requests
          </p>
          <Link 
            to="/products"
            className="inline-block bg-white text-green-600 px-12 py-4 rounded-3xl font-semibold text-lg hover:bg-gray-100 transition-all"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;