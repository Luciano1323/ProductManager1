const ProductDAO = require('../dao/productDao');

class DAOFactory {
  static getDAO(type) {
    switch (type) {
      case 'product':
        return new ProductDAO();
      // Otros casos para diferentes DAOs
      default:
        throw new Error('DAO type not supported');
    }
  }
}

module.exports = DAOFactory;
