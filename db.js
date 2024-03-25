const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const Product = mongoose.model('Product', productSchema);

const messageSchema = new Schema({
  user: String,
  message: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Product,
  Message,
};
