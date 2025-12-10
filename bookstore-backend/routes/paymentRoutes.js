const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  let { amount } = req.body;   // amount should be in rupees (number)

  amount = Number(amount);     // force numeric

 const options = {
    amount: Math.round(amount * 100), // amount in cents (subunits)
    currency: "USD",                  // use USD now
    receipt: "order_rcptid_" + Math.floor(Math.random() * 1000)
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
