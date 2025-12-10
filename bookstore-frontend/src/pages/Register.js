import React, { useState } from 'react';
import { register } from '../api/auth';
import './AuthForm.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');   // NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      await register(name, email, password);
      setMsg('Registration successful! Please login.');
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      if (backendMsg === 'User already exists') {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError(backendMsg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign Up</h2>

        {error && <div className="auth-error-popup">{error}</div>}
        {msg && <div className="auth-success-popup">{msg}</div>}

        <input
          className="auth-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="auth-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="auth-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
