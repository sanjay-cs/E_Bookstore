// src/api/checkout.js

// Create Razorpay order by calling your backend
export async function createRazorpayOrder(amount) {
  const res = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });

  if (!res.ok) {
    throw new Error('Failed to create order');
  }

  return res.json(); // returns { id, amount, currency, ... }
}

// Open Razorpay checkout popup
export function openRazorpayCheckout({ key, order, onSuccess, onFailure }) {
  if (!window.Razorpay) {
    alert('Razorpay SDK not loaded');
    return;
  }

  const options = {
    key,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    handler: function (response) {
      if (onSuccess) onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure(new Error('Payment popup closed'));
      }
    },
    theme: { color: '#3399cc' }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
