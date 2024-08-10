const { Cart, Product } = require('../models/db');
const Ticket = require('../models/ticketModel');

class CartManager {
  async purchaseCart(cartId) {
    const cart = await Cart.findById(cartId).populate('products');
    if (!cart) throw new Error('Cart not found');

    const unavailableProducts = [];
    let totalAmount = 0;

    for (const product of cart.products) {
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
      purchaser: 'user@example.com', // Replace with actual user email
    });
    await ticket.save();

    cart.products = cart.products.filter(product => unavailableProducts.includes(product._id));
    await cart.save();

    return {
      ticket,
      unavailableProducts,
    };
  }

  async addToCart(userId, productId) {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (user.role === 'premium' && product.owner.equals(user._id)) {
      throw new Error('Premium users cannot add their own products to the cart');
    }

    const cart = await Cart.findById(user.cart);
    cart.products.push(productId);
    await cart.save();
    return cart;
  }
}

module.exports = CartManager;
