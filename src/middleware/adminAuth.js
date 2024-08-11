// src/middleware/adminAuth.js
const adminAuth = (req, res, next) => {
    if (req.user && req.user.username === 'Luciano') {
      next(); // El usuario es admin, continuar
    } else {
      res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }
  };
  
  module.exports = adminAuth;
  