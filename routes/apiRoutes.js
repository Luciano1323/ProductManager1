// routes/apiRoutes.js
const express = require('express');
const passport = require('passport');
const UserDTO = require('../dto/userDto');

const router = express.Router();

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json(userDTO);
});

module.exports = router;
