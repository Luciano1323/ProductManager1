const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../config/config');

exports.generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.authenticateLocal = () => {
  return passport.authenticate('local', { session: false });
};

exports.authenticateJwt = () => {
  return passport.authenticate('jwt', { session: false });
};

exports.authenticateGithub = () => {
  return passport.authenticate('github');
};
