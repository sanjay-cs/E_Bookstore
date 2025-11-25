import React, { useState } from 'react';
import { register } from '../api/auth';
import './AuthForm.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
    setMsg('Registration successful! Please login.');
  };

  return (
    <div className='auth-page-wrapper'>
    <form className="auth-form" onSubmit={handleSubmit}>
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
      <div className="auth-message">{msg}</div>
    </form>
    </div>
  );
}

export default Register;
