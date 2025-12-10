// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Book Store.</Link>

      <div className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/cart">Bag</Link>
        <Link className="nav-link" to="/orders">Orders</Link>
      </div>

      <div className="nav-actions">
        {!token ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link className="nav-link" to="/login">Sign In</Link>
            <Link to="/register" style={{
              background: '#0071e3',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '980px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500'
            }}>Sign Up</Link>
          </div>
        ) : (
          <div className="nav-account" onClick={() => setOpen(!open)}>
            <div className="nav-account-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="nav-account-name">{user?.name?.split(' ')[0] || 'Account'}</span>

            {open && (
              <div className="nav-account-menu">
                <button onClick={() => navigate('/orders')}>My Orders</button>
                <button onClick={handleLogout} style={{ color: '#ff3b30' }}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
