// authController.js
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../config/config');

exports.login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: 'Incorrect email or password' }); }
    req.login(user, { session: false }, (err) => {
      if (err) { return next(err); }
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return res.json({ token });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
};
