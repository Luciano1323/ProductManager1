const { Product } = require('./db');

class ProductManager {
  constructor() {}

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      const newProduct = new Product({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error adding product: " + error.message);
    }
  }

  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw new Error("Error fetching product: " + error.message);
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
      if (!updatedProduct) {
        throw new Error("Product not found");
      }
      return updatedProduct;
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error("Product not found");
      }
      return deletedProduct;
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  }
}

module.exports = ProductManager;
