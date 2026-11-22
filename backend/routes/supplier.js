const express = require('express');
const { 
  supplierRegister, 
  supplierLogin, 
  addProduct, 
  getMyProducts 
} = require('../controllers/supplierController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', supplierRegister);
router.post('/login', supplierLogin);

// Protected Supplier Routes
router.post('/products', protect, addProduct);
router.get('/products', protect, getMyProducts);

module.exports = router;