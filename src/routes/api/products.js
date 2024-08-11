const express = require('express');
const router = express.Router();
const Product = require('../../models/productModel'); // Ruta del modelo de producto
const ProductManager = require('../../services/ProductManager');
const userService = require('../../services/userService');
const mailService = require('../../services/mailService');
const authMiddleware = require('../../middleware/authMiddleware');

const productManager = new ProductManager();

router.post('/', authMiddleware.isAdmin, async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }
    
    const newProduct = new Product({
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error); // Registra el error para depuración
    res.status(500).json({ error: 'Error adding product' });
  }
});
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
router.get('/', async (req, res) => {
  try {
    // Usar ProductManager para mantener consistencia
    const products = await productManager.getProducts(); 
    res.json(products);
  } catch (error) {
    console.error(error); // Registra el error para depuración
    res.status(500).json({ error: 'Error fetching products' });
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
router.delete('/:id', authMiddleware.isAdmin, async (req, res) => {
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
    console.error(error); // Registra el error para depuración
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
