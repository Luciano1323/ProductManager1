const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ajusta la ruta si es necesario

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  isAdmin
};
