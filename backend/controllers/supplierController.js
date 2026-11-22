const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Supplier
const supplierRegister = async (req, res) => {
  try {
    const { name, email, password, companyName, phone, address } = req.body;

    const existing = await Supplier.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const supplier = new Supplier({
      name,
      email,
      password: hashedPassword,
      companyName,
      phone,
      address
    });

    await supplier.save();

    res.status(201).json({ 
      message: "Supplier registered successfully. Waiting for admin approval." 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Supplier
const supplierLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const supplier = await Supplier.findOne({ email });
    if (!supplier) return res.status(400).json({ message: "Invalid credentials" });

    if (!supplier.isApproved) {
      return res.status(403).json({ message: "Your account is not approved by admin yet." });
    }

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: supplier._id, role: 'supplier' },
      process.env.JWT_SECRET || 'freshmart_secret_2026',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      supplier: {
        id: supplier._id,
        name: supplier.name,
        companyName: supplier.companyName,
        email: supplier.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Product (Supplier only)
const addProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description, image } = req.body;

    // Fixed: Use req.user instead of req.supplier
    const product = new Product({
      name,
      price,
      stock,
      category,
      description,
      image,
      supplier: req.user.id        // ← Yeh change kiya
    });

    await product.save();

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Supplier's Products
const getMyProducts = async (req, res) => {
  try {
    // Fixed: Use req.user.id
    const products = await Product.find({ supplier: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  supplierRegister,
  supplierLogin,
  addProduct,
  getMyProducts
};