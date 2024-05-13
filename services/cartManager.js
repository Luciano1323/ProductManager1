const { Cart } = require('../models/db');

class CartManager {
  constructor() {}

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cart.products = cart.products.filter(product => product.toString() !== productId);
      await cart.save();
    } catch (error) {
      throw new Error("Error removing product from cart: " + error.message);
    }
  }

  // Otros métodos para la gestión del carrito...
}

module.exports = CartManager;
