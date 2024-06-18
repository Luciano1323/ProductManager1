const express = require('express');
const passport = require('passport');
const User = require('../../models/userModel');
const { isAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

router.patch('/premium/:uid', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = user.role === 'user' ? 'premium' : 'user';
  await user.save();

  res.json({ message: `User role updated to ${user.role}` });
});

module.exports = router;
