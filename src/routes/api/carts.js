const express = require('express');
const router = express.Router();
const Cart = require('../../models/cartModel');
const CartManager = require('../../services/cartManager');
const cartManager = new CartManager();
const authMiddleware = require('../../middleware/authMiddleware');

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate('products');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching carts' });
  }
});

// Obtener un carrito por ID
router.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('products');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(400).json({ error: 'Error creating cart' });
  }
});

// Actualizar un carrito por ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('products');
    if (!updatedCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: 'Error updating cart' });
  }
});

// Eliminar un carrito por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting cart' });
  }
});

// Agregar un producto al carrito
router.post('/:cartId/products/:productId', async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await cartManager.addToCart(cartId, productId); // Asegúrate de pasar los IDs correctos
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Comprar el carrito
router.post('/:cartId/checkout', async (req, res) => {
  try {
    const { cartId } = req.params;
    const result = await cartManager.purchaseCart(cartId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
