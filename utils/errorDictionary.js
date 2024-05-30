const ERROR_DICTIONARY = {
    PRODUCT_NOT_FOUND: { code: 404, message: 'Product not found' },
    CART_NOT_FOUND: { code: 404, message: 'Cart not found' },
    INVALID_PRODUCT_DATA: { code: 400, message: 'Invalid product data' },
    UNAUTHORIZED_ACCESS: { code: 401, message: 'Unauthorized access' },
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
  };
  
  module.exports = ERROR_DICTIONARY;