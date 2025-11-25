import React from 'react';
import './CartItem.css';

function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div className="cart-item">
      <span className="cart-item-text">
        {item.productId.title} - Qty:
        <button className="qty-btn" onClick={() => onUpdateQty(item.productId._id, item.quantity - 1)}>-</button>
        <span className="qty-value">{item.quantity}</span>
        <button className="qty-btn" onClick={() => onUpdateQty(item.productId._id, item.quantity + 1)}>+</button>
      </span>
      <button className="cart-item-remove-btn" onClick={() => onRemove(item.productId._id)}>
        Remove
      </button>
    </div>
  );
}

export default CartItem;
