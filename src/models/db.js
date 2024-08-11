// models/db.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Cart = mongoose.model('Cart', cartSchema);

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Product,
  Cart,
  Message,
};
