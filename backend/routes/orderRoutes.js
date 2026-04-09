const express = require('express');
const router = express.Router();

const { 
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Customer routes
router.post('/', protect, createOrder);                    // Place order
router.get('/myorders', protect, getMyOrders);            // My orders
router.get('/:id', protect, getOrderById);                // Single order details

// Admin routes
router.get('/', protect, admin, getAllOrders);            // All orders (Admin)
router.put('/:id/status', protect, admin, updateOrderStatus);  // Update status

module.exports = router;