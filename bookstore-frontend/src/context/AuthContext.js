// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // called from Login.js after successful login
  const login = (tok, userInfo) => {
    setToken(tok);
    localStorage.setItem('token', tok);

    if (userInfo) {
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
