const express = require('express');
const router = express.Router();

// Define aquí tus rutas de mocking
router.get('/someMockRoute', (req, res) => {
  res.json({ message: 'This is a mocked route' });
});

module.exports = router;
