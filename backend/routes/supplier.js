const express = require('express');
const { 
  supplierRegister, 
  supplierLogin, 
  addProduct, 
  getMyProducts 
} = require('../controllers/supplierController');

const { protect, supplierOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', supplierRegister);
router.post('/login', supplierLogin);

// Protected Supplier Routes
router.post('/products', protect, supplierOnly, addProduct);
router.get('/products', protect, supplierOnly, getMyProducts);

module.exports = router;