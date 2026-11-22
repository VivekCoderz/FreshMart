const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all suppliers - Only for Admin
router.get('/suppliers', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const Supplier = require('../models/Supplier');
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve / Reject Supplier
router.put('/suppliers/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const Supplier = require('../models/Supplier');
    const { isApproved } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;