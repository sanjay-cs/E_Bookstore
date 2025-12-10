import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartQuantity, applyCoupon, removeCoupon } from '../api/cart';
import { placeOrder } from '../api/order';
import CartItem from '../components/CartItem';
import CouponBox from '../components/CouponBox';
import './Cart.css';
import { createRazorpayOrder, openRazorpayCheckout } from '../api/checkout';

function Cart() {
  const [cart, setCart] = useState(null);
  const [couponCelebrate, setCouponCelebrate] = useState(false);   // NEW

  useEffect(() => {
    getCart()
      .then(res => setCart(res.data))
      .catch(() => setCart(null));
  }, []);

  const handleRemove = async (productId) => {
  console.log('Removing productId from cart:', productId);
  console.log('REMOVE productId =', productId);
  try {
    await removeFromCart(productId);
    const res = await getCart();
    setCart(res.data);
  } catch (err) {
    console.error('Remove failed:', err.response?.data || err);
    alert(err.response?.data?.message || 'Failed to remove item');
  }
};


  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateCartQuantity(productId, quantity);
    const res = await getCart();
    setCart(res.data);
  };

  const handleApplyCoupon = async (code) => {
    try {
      const res = await applyCoupon(code);
      setCart(res.data);

      // trigger celebration around coupon box for 1.2s
      setCouponCelebrate(true);
      setTimeout(() => setCouponCelebrate(false), 1200);

      return true;
    } catch {
      return false;
    }
  };

  const handleRemoveCoupon = async () => {
    const res = await removeCoupon();
    setCart(res.data);
  };

  const handlePayment = async () => {
    if (!cart || !cart.total) {
      alert('Cart total not available');
      return;
    }

    try {
      const order = await createRazorpayOrder(cart.total);

      openRazorpayCheckout({
        key: 'rzp_test_us_Rk6LUTQEivBkvA', // Razorpay test key ID
        order,
        onSuccess: async (response) => {
          alert('Payment Successful! ID: ' + response.razorpay_payment_id);
          await placeOrder();
          setCart(null);
        },
        onFailure: (err) => {
          console.error(err);
          alert('Payment cancelled or failed');
        }
      });
    } catch (err) {
      console.error(err);
      alert('Failed to start payment');
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cart && cart.products.length > 0 ? (
        <div>
          {cart.products
        .filter(item => item && item.productId)   // skip bad/empty items
        .map(item => (
    <CartItem
      key={item._id || item.productId._id}
      item={item}
      onRemove={handleRemove}
      onUpdateQty={handleUpdateQuantity}
    />
  ))}


          <div className={`coupon-wrapper ${couponCelebrate ? 'coupon-celebrate' : ''}`}>
            <CouponBox
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              appliedCoupon={cart.coupon}
            />
          </div>

          <div className="cart-total">Total: ${cart.total}</div>

          <button className="cart-order-btn" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      ) : (
        <div className="cart-empty-message">Your cart is empty.</div>
      )}
    </div>
  );
}

export default Cart;
