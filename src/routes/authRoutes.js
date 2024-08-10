const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../config/config');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetExpires = Date.now() + 3600000; // 1 hour
  
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();
  
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
  // Set up nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `${resetLink}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };
  
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.status(200).json({ message: 'Email sent successfully' });
  });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  
  if (!user) {
    return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
  }
  
  if (await bcrypt.compare(newPassword, user.password)) {
    return res.status(400).json({ message: 'New password cannot be the same as the old password' });
  }
  
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  
  res.status(200).json({ message: 'Password has been reset' });
};
