import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        const productRes = await api.get(`/products/${id}`);
        setProduct(productRes.data);

        const reviewsRes = await api.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post('/reviews', {
        productId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      toast.success('Review submitted successfully!');
      
      const reviewsRes = await api.get(`/reviews/${id}`);
      setReviews(reviewsRes.data);
      
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-xl">Product not found</div>;
  }

  // Safe image URL
  const imageUrl = product.image 
    ? (product.image.startsWith('http') 
        ? product.image 
        : `/uploads/${product.image.split('/').pop()}`)
    : 'https://via.placeholder.com/600x600/22c55e/ffffff?text=FreshMart';

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Section - Balanced Size */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="aspect-square sm:aspect-[4/3] lg:aspect-square relative">
              <img 
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600/22c55e/ffffff?text=FreshMart';
                }}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-6 h-6 ${i < Math.floor(product.avgRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-600 font-medium">
                {product.avgRating ? product.avgRating.toFixed(1) : '0.0'} 
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <span className="text-5xl font-bold text-green-600">₹{product.price}</span>
              <span className="text-gray-500 ml-3">per unit</span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-10">
              <span className="font-medium text-gray-700 text-lg">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-3xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-l-3xl transition-colors"
                >
                  −
                </button>
                <span className="w-16 text-center font-semibold text-2xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-r-3xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-5 rounded-3xl text-xl font-semibold flex items-center justify-center gap-3 transition-all mb-12 shadow-sm"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart - ₹{(product.price * quantity).toFixed(2)}
            </button>

            {/* Reviews Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

              {/* Write Review */}
              <div className="bg-white rounded-3xl p-8 mb-10">
                <h3 className="font-semibold text-xl mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Rating</label>
                    <select 
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                      className="border border-gray-300 rounded-2xl px-6 py-3 w-full focus:outline-none focus:border-green-500"
                    >
                      {[5,4,3,2,1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Your Comment</label>
                    <textarea 
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded-3xl p-6 focus:outline-none focus:border-green-500"
                      placeholder="What did you think about this product?"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-10 py-4 rounded-2xl font-semibold transition-all"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Existing Reviews */}
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-8">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="bg-white rounded-3xl p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-4">
                        — {review.user?.fullName || 'Anonymous'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;