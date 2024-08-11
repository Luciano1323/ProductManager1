// config.js
require('dotenv').config();

module.exports = {
  MONGODB_URI: 'mongodb://localhost:27017/productmanager',
  JWT_SECRET: process.env.JWT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  PORT: 3000,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
