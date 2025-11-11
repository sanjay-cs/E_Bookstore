const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

// Add or update product in cart (authenticated user)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // from middleware
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    // Calculate total price
    let total = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      total += product.price * item.quantity;
    }
    cart.total = total;

    const savedCart = await cart.save();
    res.json(savedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding to cart' });
  }
});

// Get authenticated user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      'products.productId'
    );
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

// Remove a product from the cart (authenticated user)
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    // Recalculate total price
    let total = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      total += product.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.json({ message: 'Item removed', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing item' });
  }
});

module.exports = router;
