import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from '../api/cart';
import { placeOrder } from '../api/order'; // Import the order API function
import CartItem from '../components/CartItem';
import './Cart.css';
import { updateCartQuantity } from '../api/cart';

function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    getCart()
      .then(res => setCart(res.data))
      .catch(() => setCart(null));
  }, []);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    const res = await getCart();
    setCart(res.data);
  };

  // Add this function!
  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      setCart(null); // Optionally clear cart UI
      alert('Order placed successfully!');
      // Optionally redirect:
      // navigate('/orders');
    } catch (err) {
      alert('Failed to place order');
    }
  };
const handleUpdateQuantity = async (productId, quantity) => {
  if (quantity < 1) return; // Prevent less than 1
  await updateCartQuantity(productId, quantity);
  const res = await getCart();
  setCart(res.data);
};

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cart && cart.products.length > 0 ? (
        <div>
        {cart.products.map(item =>
      <CartItem
       key={item.productId._id}
        item={item}
        onRemove={handleRemove}
         onUpdateQty={handleUpdateQuantity}
        />
        )}

          
          <div className="cart-total">Total: ₹{cart.total}</div>
          {/* Place Order button */}
          <button className="cart-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
        
      ) : (
        <div className="cart-empty-message">Your cart is empty.</div>
      )}
    </div>
  );
}

export default Cart;
