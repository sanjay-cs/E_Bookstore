import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/order').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="orders-empty">No orders yet.</div>
      ) : (
        orders.map((order, idx) => (
          <div key={order._id} className="order-block">
            <div className="order-header">Order #{idx + 1} - ₹{order.total}</div>
            <ul className="order-product-list">
              {order.products.map(p => (
                <li key={p.productId._id}>{p.productId.title} (x{p.quantity})</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
