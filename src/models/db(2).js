const mongoose = require('mongoose');

// Definición del esquema del producto
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

// Comprobación y creación del modelo Product
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Definición del esquema del carrito
const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

// Comprobación y creación del modelo Cart
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

// Definición del esquema de mensajes
const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

// Comprobación y creación del modelo Message
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = {
  Product,
  Cart,
  Message,
};
