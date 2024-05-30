const ProductManager = require('../services/productService');

exports.addProduct = async (req, res, next) => {
  try {
    const product = await ProductManager.addProduct(req.body);
    res.json(product);
  } catch (error) {
    next(new Error('INVALID_PRODUCT_DATA'));
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await ProductManager.getProducts();
    res.json(products);
  } catch (error) {
    next(new Error('INTERNAL_SERVER_ERROR'));
  }
};