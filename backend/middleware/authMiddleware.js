const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'freshmart_secret_2026');
    
    // { id, role } - _id alias keeps controllers that read req.user._id working
    req.user = { ...decoded, _id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  next();
};

const supplierOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'supplier') {
    return res.status(403).json({ message: "Not authorized as supplier" });
  }
  next();
};

module.exports = { protect, adminOnly, supplierOnly };