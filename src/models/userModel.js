const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  last_connection: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
