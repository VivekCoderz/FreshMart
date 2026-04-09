const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: 'admin@freshmart.com' });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      fullName: "FreshMart Admin",
      email: "admin@freshmart.com",
      password: hashedPassword,
      phone: "9876543210",
      role: "admin"
    });

    console.log('✅ Admin created successfully!');
    console.log('Email: admin@freshmart.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

createAdmin();