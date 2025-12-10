import React, { useEffect, useState } from 'react';
import { getOrders } from '../api/order';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        setError('Could not load your orders. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="orders-loading">Loading...</div>;

  return (
    <div className="orders-page fade-in">
      <div className="container">
        <h1 className="orders-header">Order History</h1>

        {error && <div className="orders-error">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <p>You haven't placed any orders yet.</p>
            <a href="/" className="orders-shop-btn">Start Shopping</a>
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header-row">
                <span className="order-date">
                  {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="order-status completed">Completed</span>
              </div>

              <div className="order-items">
                {order.products.map((item) => (
                  <div key={item._id} className="order-item">
                    {/* Safe check for productId incase it was deleted */}
                    <div className="order-thumb">
                      {item.productId && item.productId.image ? (
                        <img src={item.productId.image} alt={item.productId.title} />
                      ) : (
                        <div className="thumb-placeholder" />
                      )}
                    </div>
                    <div className="order-info">
                      <h3 className="order-book-title">
                        {item.productId ? item.productId.title : 'Unknown Book'}
                      </h3>
                      <p className="order-book-qty">Qty: {item.quantity}</p>
                    </div>
                    <div className="order-book-price">
                      {item.productId ? `$${item.productId.price}` : '-'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span>Total</span>
                <span className="order-total-price">${order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
