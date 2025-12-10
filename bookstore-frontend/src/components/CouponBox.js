import React, { useState } from 'react';
import './CouponBox.css';

function CouponBox({ onApply, onRemove, appliedCoupon }) {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    const ok = await onApply(code.trim());
    setMsg(ok ? 'Coupon applied!' : 'Invalid coupon');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleRemove = async () => {
    await onRemove();
    setCode('');
    setMsg('Coupon removed');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="coupon-box">
      <h4>Have a coupon?</h4>

      {appliedCoupon ? (
        <div className="coupon-applied-row">
          <span>Applied: <strong>{appliedCoupon}</strong></span>
          <button onClick={handleRemove}>Remove</button>
        </div>
      ) : (
        <div className="coupon-row">
          <input
            type="text"
            placeholder="Enter coupon code (e.g. BEST25)"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
          />
          <button onClick={handleApply}>Apply</button>
        </div>
      )}

      {msg && <div className="coupon-msg">{msg}</div>}
    </div>
  );
}


export default CouponBox;
