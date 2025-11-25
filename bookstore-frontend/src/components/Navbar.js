import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/cart">Cart</Link>
      <Link className="nav-link" to="/orders">Orders</Link>
      <Link className="nav-link" to="/login">Login</Link>
      <Link className="nav-link" to="/register">Register</Link>
    </nav>
  );
}
export default Navbar;
