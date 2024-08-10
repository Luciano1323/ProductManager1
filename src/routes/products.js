const express = require('express');
const router = express.Router();
const ProductManager = require('../../services/ProductManager');
const userService = require('../../services/userService');
const mailService = require('../../services/mailService');
const authMiddleware = require('../../middleware/authMiddleware');
const productManager = new ProductManager();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *       example:
 *         id: d5fE_asz
 *         name: Apple
 *         price: 1.99
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/products', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deletes a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */

router.delete('/products/:id', authMiddleware.isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productManager.getProductById(productId);
    if (product) {
      await productManager.deleteProduct(productId);
      const user = await userService.getUserById(product.ownerId);
      if (user && user.role === 'premium') {
        mailService.sendMail(user.email, 'Product Deleted', `Your product "${product.name}" has been deleted.`);
      }
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
