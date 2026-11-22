const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate Token with Role
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                    // ← Role yahan pass ho raha hai
    process.env.JWT_SECRET || 'freshmart_secret_2026',
    { expiresIn: '30d' }
  );
};

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: 'customer'
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User (Admin + Customer)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Special check for admin (temporary)
    if (email === 'admin@freshmart.com') {
      // Aapke database wala hashed password yahan paste kar do
      const adminHashedPassword = "$2b$10$sqvmv6ssdFc8hTAD9aoqgQuB8n63SCdjfq73mcGJaI6Z3E0XsOvIbC"; 

      if (await bcrypt.compare(password, adminHashedPassword)) {
        res.json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id, user.role)
        });
        return;
      }
    }

    // Normal user login
    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};