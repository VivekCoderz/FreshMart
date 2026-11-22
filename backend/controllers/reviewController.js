const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review for a product
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Update product's average rating
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0) / numReviews;

    product.avgRating = Number(avgRating.toFixed(1));
    product.numReviews = numReviews;
    await product.save();

    await review.populate('user', 'fullName');

    res.status(201).json({
      success: true,
      message: "Thank you for your review!",
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews
};