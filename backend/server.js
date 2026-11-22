const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const supplierRouter = require("./routes/supplier");
const adminRouter = require("./routes/admin");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));   // Serve product images

// Connect to Database
connectDB();

// Routes (we will create these next)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/supplier', supplierRouter);
app.use('/api/admin', adminRouter);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FreshMart Backend API 🍎🥕' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});