import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Safe image URL
  const imageUrl = product.image 
    ? (product.image.startsWith('http') 
        ? product.image 
        : `/uploads/${product.image.split('/').pop()}`)
    : 'https://via.placeholder.com/400x300/22c55e/ffffff?text=FreshMart';

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
    >
      {/* Image Container - FIXED SIZE */}
      <div className="relative h-52 sm:h-60 lg:h-64 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/22c55e/ffffff?text=FreshMart';
          }}
        />
        
        {/* Stock Badge */}
        {product.stock > 0 ? (
          <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
            In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
            Out of Stock
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-3 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.avgRating || 0) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1.5">
              {product.avgRating ? product.avgRating.toFixed(1) : 'New'}
            </span>
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
            <span className="text-xs text-gray-500 ml-1">/ unit</span>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3.5 rounded-2xl transition-all active:scale-95 shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;