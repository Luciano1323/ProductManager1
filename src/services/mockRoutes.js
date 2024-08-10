const express = require('express');
const MockingService = require('../services/mockingService');

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
  const products = MockingService.generateMockProducts();
  res.json(products);
});

module.exports = router;