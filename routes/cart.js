const express = require('express');
const router = express.Router();
const CartManager = require('../../services/cartManager');
const cartManager = new CartManager();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the cart item
 *         productId:
 *           type: string
 *           description: The id of the product
 *         quantity:
 *           type: number
 *           description: The quantity of the product in the cart
 *       example:
 *         id: abc123
 *         productId: d5fE_asz
 *         quantity: 3
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The cart managing API
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Returns the contents of the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: The contents of the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 */

router.get('/cart', async (req, res) => {
  try {
    const cart = await cartManager.getCart();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
