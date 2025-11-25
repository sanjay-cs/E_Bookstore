import React, { useState, useContext } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    saveToken(res.data.token);
    navigate('/');
  };

  return (
    <div className="auth-page-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign In</h2>
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
          placeholder="Password"
          type="password"
          required
        />
        <button className="auth-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
