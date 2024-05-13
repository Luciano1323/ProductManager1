const ProductDao = require('../dao/productDao');

exports.getProducts = async () => {
  return await ProductDao.getProducts();
};

exports.addProduct = async (productData) => {
  return await ProductDao.addProduct(productData);
};

