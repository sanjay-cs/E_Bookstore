const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware




async function recalculateTotal(cart) {
  let total = 0;
  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (!product) continue; // skip deleted products
    total += product.price * item.quantity;
  }
  return total;
}


// Add or update product in cart (authenticated user)
// routes/cartRoutes.js
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;              // from middleware
    let { productId, quantity } = req.body;

    console.log('ADD TO CART', { userId, productId, quantity });

    // basic validation
    if (!productId) {
      return res
        .status(400)
        .json({ message: 'productId is required' });
    }

    quantity = Number(quantity) || 1;
    if (quantity < 1) quantity = 1;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // first item in new cart
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // make sure productId exists before toString()
      const productIndex = cart.products.findIndex(
        (p) => p.productId && p.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    // recalc total from DB prices
    cart.total = await recalculateTotal(cart);

    // re-apply coupon if active
    if (cart.coupon === 'BEST25') {
      cart.total = Math.round(cart.total * 0.75);
    }

    const savedCart = await cart.save();
    return res.json(savedCart);
  } catch (error) {
    console.error('ADD TO CART error:', error);
    return res
      .status(500)
      .json({ message: 'Server error adding to cart' });
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
// Remove a product from the cart (authenticated user)
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    console.log('DELETE /cart', { userId, productId });

    const cart = await Cart.findOne({ userId });
    console.log('Found cart?', !!cart, 'items:', cart?.products.length);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // SAFER: handle items where productId might be missing
    cart.products = cart.products.filter((item) => {
      if (!item.productId) return true; // keep malformed items, or `false` if you want to clean them
      return item.productId.toString() !== productId;
    });

    cart.total = await recalculateTotal(cart);
    if (cart.coupon === 'BEST25') {
      cart.total = Math.round(cart.total * 0.75);
    }

    await cart.save();
    return res.json({ message: 'Item removed', cart });
  } catch (error) {
    console.error('Remove error:', error);
    return res
      .status(500)
      .json({ message: 'Server error removing item' });
  }
});


// Update quantity for a product in cart
router.put('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { quantity } = req.body;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.products.find(
      (i) => i.productId.toString() === productId
    );
    if (!item) return res.status(404).json({ message: 'Product not found in cart' });

    item.quantity = quantity > 0 ? quantity : 1;

    // Recalculate total
   cart.total = await recalculateTotal(cart);
   // IMPORTANT: apply discount again if coupon is active
    if (cart.coupon === 'BEST25') {
    cart.total = Math.round(cart.total * 0.75);
    }


    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating quantity' });
  }
});

router.post('/apply-coupon', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { coupon, remove } = req.body; // remove = true to clear

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // always start from full total (no discount)
    let baseTotal = await recalculateTotal(cart);

    // remove coupon
    if (remove) {
      cart.coupon = null;
      cart.total = baseTotal;
      await cart.save();
      return res.json(cart);
    }

    // apply coupon only if not already applied
    if (coupon && coupon.toUpperCase() === 'BEST25') {
      cart.coupon = 'BEST25';
      cart.total = Math.round(baseTotal * 0.75);
    } else {
      // invalid code: do not change coupon or total
      cart.total = baseTotal;
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error applying coupon' });
  }
});


 
module.exports = router;
