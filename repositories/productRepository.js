// repositories/productRepository.js
const DAOFactory = require('../factories/daoFactory');

class ProductRepository {
  constructor() {
    this.productDAO = DAOFactory.getDAO('product');
  }

  async getAllProducts() {
    return await this.productDAO.getProducts();
  }

  async createProduct(productData) {
    return await this.productDAO.addProduct(productData);
  }

  // Otros métodos que utilizan el DAO
}

module.exports = ProductRepository;
