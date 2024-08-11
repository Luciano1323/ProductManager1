const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const Product = mongoose.model('Product', productSchema); // Esto debe ser eliminado

module.exports = Product;
