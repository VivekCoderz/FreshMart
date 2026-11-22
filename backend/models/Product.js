const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  image: String,
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  
  // Link to Supplier (admin-created and older products have none)
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);