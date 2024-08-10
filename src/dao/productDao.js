const { Product } = require('../models/db');

class ProductDAO {
  async getProducts() {
    return await Product.find();
  }

  async addProduct(productData) {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  // Otros métodos DAO como updateProduct, deleteProduct, etc.
}

module.exports = ProductDAO;
