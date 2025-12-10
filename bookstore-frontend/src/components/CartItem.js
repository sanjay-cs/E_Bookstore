import React from 'react';
import './CartItem.css';

function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <span className="cart-item-title">{item.productId.title}</span>
        <div className="cart-item-controls">
          <button className="qty-btn" onClick={() => onUpdateQty(item.productId._id, item.quantity - 1)}>−</button>
          <span className="qty-value">{item.quantity}</span>
          <button className="qty-btn" onClick={() => onUpdateQty(item.productId._id, item.quantity + 1)}>+</button>
        </div>
      </div>
      <button className="cart-item-remove-btn" onClick={() => onRemove(item.productId._id)}>
        Remove
      </button>
    </div>
  );
}

export default CartItem;

/*new one*/
