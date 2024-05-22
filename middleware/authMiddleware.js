function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  
  function isUser(req, res, next) {
    if (req.user.role === 'user') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden: Users only' });
  }
  
  module.exports = { isAdmin, isUser };
  