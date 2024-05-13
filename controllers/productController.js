// productController.js
const ProductManager = require('../services/productService');

exports.getProducts = async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await ProductManager.addProduct(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
