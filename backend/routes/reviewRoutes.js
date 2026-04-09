const express = require('express');
const router = express.Router();

const { createReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public - Get reviews for a product
router.get('/:productId', getProductReviews);

// Protected - Add a review (user must be logged in)
router.post('/', protect, createReview);

module.exports = router;