// apiRoutes.js
const express = require('express');
const passport = require('passport');
const User = require('./userModel');

const router = express.Router();

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
