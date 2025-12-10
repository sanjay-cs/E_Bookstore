const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const cartSchema = mongoose.Schema({
  products: [itemSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total: { type: Number, default: 0 },
  coupon: { type: String, default: null }, 
});

module.exports = mongoose.model('Cart', cartSchema);
//comment