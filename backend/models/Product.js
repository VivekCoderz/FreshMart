const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true,
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Pantry', 'Meat', 'Bakery']
  },
  stock: { type: Number, required: true, default: 0, min: 0 },
  image: { type: String, required: true },   // URL or path like /uploads/onion.jpg
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);