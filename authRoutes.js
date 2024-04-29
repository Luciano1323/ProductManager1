// authRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./userModel');

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
  // Generate JWT token
  const token = jwt.sign({ sub: req.user._id }, 'your_secret_key', { expiresIn: '1h' });
  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json({ message: 'Logged in successfully', token });
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
