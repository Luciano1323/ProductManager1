const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor() {
    this.path = "productos.json";
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data) || [];
    } catch (error) {
      console.error("Error loading products:", error.message);
    }
  }

  saveProducts() {
    try {
      const productsToSave = this.products.filter(product => product !== null);
      fs.writeFileSync(
        this.path,
        JSON.stringify(productsToSave, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Error saving products:", error.message);
    }
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Error: All fields are required.");
    }

    const id = uuidv4();
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const productWithSameCode = this.products.find(product => product.code === code);
    if (productWithSameCode) {
      throw new Error("Error: Product code already exists.");
    }

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  getProducts() {
    return this.products.filter(product => product !== null);
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);

    if (!product) {
      console.error("Error: Product not found.");
      return null;
    }

    return product;
  }

  updateProduct(productId, updatedFields) {
    const index = this.products.findIndex((product) => product.id === productId);

    if (index === -1) {
      throw new Error("Error: Product not found.");
    }

    const product = this.products[index];
    const updatedProduct = { ...product, ...updatedFields };

    this.products[index] = updatedProduct;
    this.saveProducts();
  }

  deleteProduct(productId) {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== productId);

    if (initialLength === this.products.length) {
      console.error("Error: Product not found.");
      return null;
    }

    this.saveProducts();
  }
}

module.exports = ProductManager;