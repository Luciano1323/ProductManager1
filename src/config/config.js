// config.js
require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URL, // Usa la variable de entorno
  JWT_SECRET: process.env.JWT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  PORT: process.env.PORT || 3000, // Usa la variable de entorno o el valor por defecto
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
