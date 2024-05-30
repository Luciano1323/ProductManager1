const { v4: uuidv4 } = require('uuid');

class MockingService {
  static generateMockProducts(count = 100) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push({
        id: uuidv4(),
        title: `Product ${i + 1}`,
        description: `Description for Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 1,
        thumbnail: `url_to_image_${i + 1}`,
        code: `CODE${i + 1}`,
        stock: Math.floor(Math.random() * 100) + 1,
      });
    }
    return products;
  }
}

module.exports = MockingService;