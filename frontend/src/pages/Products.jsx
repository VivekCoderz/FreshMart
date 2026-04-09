import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'All';
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || ''); // Live input
  const sortOption = searchParams.get('sort') || 'newest';

  // Live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() === '') {
        searchParams.delete('search');
      } else {
        searchParams.set('search', searchInput.trim());
      }
      setSearchParams(searchParams);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/products';

      const params = new URLSearchParams();
      if (currentCategory !== 'All') params.append('category', currentCategory);
      if (searchParams.get('search')) params.append('search', searchParams.get('search'));
      if (sortOption) params.append('sort', sortOption);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(['All', ...res.data]);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, searchParams.get('search'), sortOption]);

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
    setShowFilters(false);
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900">Shop Products</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-lg">Discover fresh groceries from local farms</p>
        </div>

        {/* Search & Controls Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Search Input - Live Search */}
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-100 border border-transparent focus:border-green-400 rounded-2xl focus:outline-none text-base placeholder:text-gray-500"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="bg-white border border-gray-300 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-green-500 sm:w-56"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 bg-white border border-gray-300 px-6 py-4 rounded-2xl"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`${showFilters ? 'block' : 'hidden sm:block'} mb-10`}>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-7 py-3 rounded-full font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  currentCategory === category
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-white border border-gray-300 hover:border-green-300 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {(currentCategory !== 'All' || searchInput) && (
            <button
              onClick={clearAllFilters}
              className="mt-4 flex items-center gap-2 text-red-600 text-sm hover:underline"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-80 sm:h-96 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <p className="text-3xl text-gray-400">No products found</p>
            <p className="text-gray-500 mt-3">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
  {products.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
        )}
      </div>
    </div>
  );
};

export default Products;