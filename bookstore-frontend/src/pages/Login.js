import React, { useState, useContext } from 'react';
import { login as loginApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');          // NEW
  const { login: saveAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginApi(email, password);
      saveAuth(res.data.token, res.data.user);      // or just token if needed
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Invalid email or password';
      setError(msg);                               // set message instead of alert
    }
  };

  return (
    <div className="auth-page-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign In</h2>

        {error && (
          <div className="auth-error-popup">
            {error}
          </div>
        )}

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
