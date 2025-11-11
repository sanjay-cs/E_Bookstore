const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate and get userId

// Place an order from the user's cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare order products array
    const orderProducts = cart.products.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    // Create new order
    const newOrder = new Order({
      userId,
      products: orderProducts,
      total: cart.total,
    });

    await newOrder.save();

    // Optional: Clear user's cart after placing order
    cart.products = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error placing order' });
  }
});

// Get all orders for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).populate('products.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

module.exports = router;
