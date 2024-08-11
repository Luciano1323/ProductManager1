const { Cart, Product } = require('../models/db');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

class CartManager {
  async purchaseCart(cartId) {
    const cart = await Cart.findById(cartId).populate('products');
    if (!cart) throw new Error('Cart not found');

    const unavailableProducts = [];
    let totalAmount = 0;

    for (const product of cart.products) {
      // Verificar si el producto tiene todos los campos requeridos
      if (!product.name || !product.price || !product.stock) {
        unavailableProducts.push(product._id);
        continue;
      }
      
      if (product.stock < 1) {
        unavailableProducts.push(product._id);
      } else {
        product.stock -= 1;
        totalAmount += product.price;
        await product.save();
      }
    }

    const ticket = new Ticket({
      amount: totalAmount,
      purchaser: 'user@example.com', // Cambia esto por el correo real del usuario
    });
    await ticket.save();

    cart.products = cart.products.filter(product => !unavailableProducts.includes(product._id));
    await cart.save();

    return {
      ticket,
      unavailableProducts,
    };
  }


  async addToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      // Lógica para agregar el producto al carrito
      cart.products.push(productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async purchaseCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      // Lógica para realizar la compra
      // Vaciar el carrito después de la compra
      cart.products = [];
      await cart.save();
      return { message: 'Purchase successful' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CartManager;

module.exports = CartManager;
