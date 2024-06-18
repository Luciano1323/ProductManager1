function isAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: Admins only' });
}

function isUser(req, res, next) {
  if (req.user.role === 'user' || req.user.role === 'premium') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: Users only' });
}

function isPremium(req, res, next) {
  if (req.user.role === 'premium') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: Premium users only' });
}

module.exports = { isAdmin, isUser, isPremium };
