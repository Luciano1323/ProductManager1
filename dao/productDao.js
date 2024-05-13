// productDao.js
const { Product } = require('../models/db');

exports.getProducts = async () => {
  return await Product.find();
};

exports.addProduct = async (productData) => {
  const newProduct = new Product(productData);
  await newProduct.save();
  return newProduct;
};

