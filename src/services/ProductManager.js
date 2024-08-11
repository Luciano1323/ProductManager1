// src/services/ProductManager.js
const Product = require('../models/productModel'); // Asegúrate de que la ruta es correcta

class ProductManager {
  async getProducts() {
    try {
      return await Product.find(); // Asumiendo que 'Product' es el modelo de Mongoose
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }


  async getProductById(id) {
    try {
      return await Product.findById(id); // Obtiene un producto por ID
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id); // Elimina un producto por ID
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }
}

module.exports = ProductManager;
