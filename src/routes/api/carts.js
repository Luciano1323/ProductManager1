const express = require('express');
const router = express.Router();
const Cart = require('../../models/cartModel');

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

module.exports = router;
